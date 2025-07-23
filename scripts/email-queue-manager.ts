import { PrismaClient } from '@prisma/client';
import { 
  retryAllFailedEmails, 
  getQueueStatus, 
  getAllEmailFailures,
  cleanupResolvedFailures,
  startScheduledRetries,
  stopScheduledRetries
} from '../src/services/emailQueue.service';

const prisma = new PrismaClient();

interface RetryResult {
  failureId: string;
  jobId?: string | number;
  status: string;
  error?: string;
}

interface FailureResult {
  failures: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const commands = {
  async status(): Promise<void> {
    console.log('📊 Email Queue Status');
    console.log('====================');
    
    const status = await getQueueStatus();
    console.log(`Queue Jobs:`);
    console.log(`  Waiting: ${status.waiting}`);
    console.log(`  Active: ${status.active}`);
    console.log(`  Completed: ${status.completed}`);
    console.log(`  Failed: ${status.failed}`);
    console.log(`\nDatabase Failures:`);
    console.log(`  Total Failures: ${status.totalFailures}`);
    console.log(`  Unresolved: ${status.unresolvedFailures}`);
    console.log(`  Pending Retries: ${status.pendingRetries}`);
  },

  async failures(page: string | number = 1, limit: string | number = 10): Promise<void> {
    console.log(`📧 Email Failures (Page ${page}, Limit ${limit})`);
    console.log('==========================================');
    
    const result: FailureResult = await getAllEmailFailures(parseInt(String(page)), parseInt(String(limit)));
    
    if (result.failures.length === 0) {
      console.log('No failures found.');
      return;
    }

    result.failures.forEach((failure: any, index: number) => {
      console.log(`\n${index + 1}. ${failure.email}`);
      console.log(`   Subject: ${failure.subject}`);
      console.log(`   Attempts: ${failure.attempts}/${failure.maxAttempts}`);
      console.log(`   Status: ${failure.isResolved ? '✅ Resolved' : '❌ Failed'}`);
      console.log(`   Last Attempt: ${failure.lastAttempt}`);
      console.log(`   Next Retry: ${failure.nextRetry || 'Not scheduled'}`);
      console.log(`   Error: ${failure.error.substring(0, 100)}${failure.error.length > 100 ? '...' : ''}`);
    });

    console.log(`\nPagination: Page ${result.pagination.page} of ${result.pagination.pages} (${result.pagination.total} total)`);
  },

  async retry(): Promise<void> {
    console.log('🔄 Retrying Failed Emails');
    console.log('==========================');
    
    const results: RetryResult[] = await retryAllFailedEmails();
    
    if (results.length === 0) {
      console.log('No emails to retry.');
      return;
    }

    console.log(`Retried ${results.length} emails:`);
    results.forEach((result: RetryResult, index: number) => {
      if (result.status === 'queued') {
        console.log(`  ✅ ${index + 1}. ${result.failureId} -> Job ${result.jobId}`);
      } else {
        console.log(`  ❌ ${index + 1}. ${result.failureId} - ${result.error}`);
      }
    });
  },

  async cleanup(daysOld: string | number = 30): Promise<void> {
    console.log(`🧹 Cleaning up resolved failures older than ${daysOld} days`);
    console.log('==================================================');
    
    const cleanedCount: number = await cleanupResolvedFailures(parseInt(String(daysOld)));
    console.log(`Cleaned up ${cleanedCount} resolved email failures.`);
  },

  async startScheduler(interval: string | number = 5): Promise<void> {
    console.log(`⏰ Starting scheduled retries every ${interval} minutes`);
    console.log('===============================================');
    
    startScheduledRetries(parseInt(String(interval)));
    console.log('Scheduled retries started. Press Ctrl+C to stop.');
    
    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping scheduled retries...');
      stopScheduledRetries();
      process.exit(0);
    });
  },

  async help(): Promise<void> {
    console.log('📧 Email Queue Manager');
    console.log('=====================');
    console.log('\nAvailable commands:');
    console.log('  status                    - Show queue and failure status');
    console.log('  failures [page] [limit]   - List email failures (default: page 1, limit 10)');
    console.log('  retry                     - Retry all failed emails');
    console.log('  cleanup [days]            - Clean up resolved failures (default: 30 days)');
    console.log('  start-scheduler [minutes] - Start automatic retry scheduler (default: 5 minutes)');
    console.log('  help                      - Show this help message');
    console.log('\nExamples:');
    console.log('  node scripts/email-queue-manager.js status');
    console.log('  node scripts/email-queue-manager.js failures 2 5');
    console.log('  node scripts/email-queue-manager.js retry');
    console.log('  node scripts/email-queue-manager.js cleanup 7');
    console.log('  node scripts/email-queue-manager.js start-scheduler 10');
  }
};

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  const params = args.slice(1);

  try {
    if (commands[command as keyof typeof commands]) {
      const commandFn = commands[command as keyof typeof commands] as (...args: any[]) => Promise<void>;
      await commandFn(...params);
    } else {
      console.log(`❌ Unknown command: ${command}`);
      await commands.help();
    }
  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export default commands; 