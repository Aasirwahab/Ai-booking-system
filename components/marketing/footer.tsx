import Link from "next/link";
import { Bot, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">
                BookingAI
              </span>
            </Link>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              Empowering service businesses with autonomous AI agents that handle 
              bookings, customer inquiries, and calendar management 24/7.
            </p>
            <div className="flex gap-4 mt-6">
              <Twitter className="w-5 h-5 text-slate-400 hover:text-teal-600 cursor-pointer transition-colors" />
              <Github className="w-5 h-5 text-slate-400 hover:text-teal-600 cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-slate-400 hover:text-teal-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-slate-500 hover:text-teal-600 transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-slate-500 hover:text-teal-600 transition-colors">Pricing</Link></li>
              <li><Link href="#demo" className="text-slate-500 hover:text-teal-600 transition-colors">Book a Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-slate-500 hover:text-teal-600 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-teal-600 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-teal-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} BookingAI. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-400">
            <Link href="#" className="hover:text-teal-600 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-teal-600 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
