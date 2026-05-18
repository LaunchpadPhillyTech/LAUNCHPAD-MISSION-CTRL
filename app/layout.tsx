"use client";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppShell from "./AppShell";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const isLoginPage = pathname === "/login";

	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`} style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
				<AuthProvider>
					<ThemeProvider>
						{isLoginPage ? (
							<main>{children}</main>
						) : (
							<AppShell>{children}</AppShell>
						)}
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
