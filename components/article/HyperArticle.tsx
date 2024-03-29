// Copyright (c) 2022-2024. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { PropsWithChildren, ReactNode } from "react";
import { HYPER_ARTICLE_CLASS_NAME } from "../../../core/constants/classNames";
import { StyleDTO } from "../../../core/entities/style/StyleDTO";
import { StyleEntity } from "../../../core/entities/style/StyleEntity";
import { PropsWithClassName } from "../types/PropsWithClassName";
import "./HyperArticle.scss";

export interface HyperArticleProps
    extends
        PropsWithClassName,
        PropsWithChildren
{
    readonly className ?: string;
    readonly children  ?: ReactNode;
    readonly style ?: StyleDTO;
}

export function HyperArticle (props: HyperArticleProps) {
    const className = props?.className;
    const children = props?.children;
    const style = props?.style;
    return (
        <article className={HYPER_ARTICLE_CLASS_NAME + (className ? ` ${className}` : "")}
                 style={ style ? StyleEntity.create(style).getCssStyles() : {} }
        >{children}</article>
    );
}
