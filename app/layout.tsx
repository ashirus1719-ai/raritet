import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import MobileBottomNav from "./components/MobileBottomNav";
import AdminHotkey from "./components/AdminHotkey";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Раритет — книжный магазин в Бишкеке",
  description: "Книги, детская литература, издания о Кыргызстане и подарочные альбомы. Книжный магазин «Раритет» в Бишкеке.",
};

// Tablets show the desktop layout scaled down to fit, instead of the phone layout:
// a device whose short side is at least 600px but whose current width is under 1024px
// gets a 1024px-wide viewport, which the browser shrinks to the screen. Phones and desktops are untouched.
const TABLET_VIEWPORT_SCRIPT = `(function(){
var D=1024;
function fit(){
  var sw=screen.width,sh=screen.height,short=Math.min(sw,sh),long=Math.max(sw,sh);
  var land=screen.orientation&&screen.orientation.type?screen.orientation.type.indexOf("landscape")===0:Math.abs(window.orientation||0)===90;
  var cur=land?long:short;
  var want=short>=600&&cur<D?"width="+D:"width=device-width, initial-scale=1";
  var metas=document.querySelectorAll('meta[name="viewport"]');
  if(!metas.length){var m=document.createElement("meta");m.name="viewport";document.head.appendChild(m);metas=[m];}
  for(var i=0;i<metas.length;i++)if(metas[i].content!==want)metas[i].content=want;
}
fit();
new MutationObserver(fit).observe(document.head,{childList:true,subtree:true,attributes:true,attributeFilter:["content"]});
if(screen.orientation&&screen.orientation.addEventListener)screen.orientation.addEventListener("change",fit);
else window.addEventListener("orientationchange",fit);
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}>
      <head><script dangerouslySetInnerHTML={{ __html: TABLET_VIEWPORT_SCRIPT }} /></head>
      <body className="min-h-full">{children}<MobileBottomNav /><AdminHotkey /></body>
    </html>
  );
}

// NotMyPanel17