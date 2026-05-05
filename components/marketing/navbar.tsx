"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  SignInButton, 
  SignUpButton, 
  UserButton, 
  useAuth 
} from "@clerk/nextjs";
import { Bot, Menu, X } from "lucide-react";
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";

const navigation = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Demo", href: "#demo" },
];

export function Navbar() {
  const { isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">
              BookingAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">Log in</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="gradient-brand hover:opacity-90">Get Started</Button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger 
              render={
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              }
            />
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-teal-600" />
                    BookingAI
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)} className="text-lg font-medium">{item.name}</Link>
                  ))}
                  <hr className="my-2" />
                  {isSignedIn ? (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Go to Dashboard</Button>
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <SignInButton mode="modal">
                        <Button variant="outline" className="w-full">Log in</Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button className="w-full gradient-brand">Get Started</Button>
                      </SignUpButton>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
