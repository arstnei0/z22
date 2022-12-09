import { Component, JSX } from "solid-js";

export default ((props) => {
    return <div style="background-color: red;">
        {props.children}
    </div>
}) as Component<{ children: JSX.Element }>
