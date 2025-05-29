'use client'
import Image from "next/image";
import {APP_NAME} from "@/lib/constants";
import Link from "next/link";

export function IconIndex(){
    return(
        <Link
            href='/'
            className='flex items-center header-button font-extrabold text-2xl m-1 '
        >
            <Image
                onError={
                    (e) => {
                        e.currentTarget.srcset= "/images/imagenotfound.png";
                    }
                }
                src='/icons/logo.svg'
                width={40}
                height={40}
                alt={`${APP_NAME} logo`}
            />
            {APP_NAME}
        </Link>
    )
}