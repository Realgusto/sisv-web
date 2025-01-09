import dynamic from 'next/dynamic'
import NotFoundJSON from '@/assets/NotFound.json'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type NotFoundProps = {
    title?: string
}

export default function NotFound({ title }: NotFoundProps) {
    return(
        <div className="p-4 space-y-4 w-full max-w-full overflow-x-hidden">
            <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
                <Lottie
                    animationData={NotFoundJSON}
                    loop={true}
                    autoplay={true}
                    className="w-72"
                />
                <h1 className="text-lg font-bold text-center text-wrap">
                    {title ? title : 'Registros não encontrados'}
                </h1>
            </div>
        </div>
    )
}