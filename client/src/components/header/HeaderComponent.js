import React from 'react'
import "../header/HeaderComponent.css"

export const HeaderComponent = () => {
    return (
        <div className="header">
            <span className="header__logo">
                <a href="/">
                    <i className="fab fa-react"/>
                </a>
            </span>
        </div>
    )
}