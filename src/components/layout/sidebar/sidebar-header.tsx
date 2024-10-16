import Image from 'next/image';

const SidebarHeader = () => {
    return (
        <div className="flex space-x-2">
            <Image
                src="/profile.png"
                alt="Avatar"
                height="40"
                width="40"
                className="object-cover object-top rounded-full flex-shrink-0"
            />
            <div className="flex text-sm flex-col">
                <p className="font-bold text-primary">Shirone</p>
                <p className="font-light text-muted-foreground">Developer</p>
            </div>
        </div>
    );
};


export default SidebarHeader;