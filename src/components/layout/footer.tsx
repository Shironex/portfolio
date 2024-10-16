'use client';

const Footer = () => {
    return (
        <div className="p-4 text-center justify-center text-xs text-neutral-500 border-t border-neutral-100">
            <span className="font-semibold">{new Date().getFullYear()} </span>
            &#8212; Built by Shironex
        </div>
    );
};

export default Footer;
