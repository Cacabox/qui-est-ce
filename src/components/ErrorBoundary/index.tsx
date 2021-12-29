import React, { Component } from "react";
import { Translation, useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import { getTwitchToken } from "@helpers/token";

import "./style.css";

interface ErrorBoundaryProps {}

interface ErrorBoundaryState {
    hasError: boolean,
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);

        this.state = {
            hasError: false
        }
    }

    static getDerivedStateFromError(error: Error) {
        return {
            hasError: true
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error">
                    <Translation>
                    {
                        t => <div>{ t("error-boundary.error") }</div>
                    }
                    </Translation>

                    <Recovery />
                </div>
            )
        }

        return this.props.children;
    }
}

const Recovery = () => {
    const setTwitchToken = useSetRecoilState(getTwitchToken);

    const reset = () => {
        setTwitchToken("");

        window.location.reload();
    }

    const { t } = useTranslation();

    return (
        <button onClick={ () => reset() }>{ t("error-boundary.reset") }</button>
    )
}
