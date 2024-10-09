'use client'

import { Fragment } from "react"

interface HashTagsProps {
    tags: string[]
}
export function HashTags(
    { tags }: HashTagsProps
) {
    return (
        <Fragment>
            {
                tags.map((tag, index) => (
                    <div key={index} className="flex items-center text-lg gap-0.5 font-black tracking-tighter">
                        <span
                            className="text-primary-main"
                        >#</span>
                        <span className="rounded-full">{tag}</span>
                        {index < tags.length - 1 && ','}
                    </div>
                ))
            }
        </Fragment>
    )
}