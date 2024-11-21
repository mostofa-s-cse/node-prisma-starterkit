import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Hash a password for the super admin user
    const superAdminPassword = "superadmin123"; // You can change this password
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

    // Create a super admin user
    const superAdmin = await prisma.user.create({
        data: {
            name: "Super Admin",    // Super Admin Name
            email: "superadmin@example.com",  // Super Admin Email (unique)
            password: hashedPassword,  // Hashed Password
            emailVerified: true,  // Email is verified for admin
            otp: null,  // No OTP required for admin
            refreshToken: "",  // You can leave this empty for now
            passwordResetToken: "",  // No password reset token for super admin
            passwordResetTokenExpires: null,  // No expiration needed
            profileImage: null,  // No expiration needed
        },
    });

    console.log("Super admin user created:", superAdmin);
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
