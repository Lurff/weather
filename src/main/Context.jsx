import { createContext, useRef, useState } from "react";

const Context = createContext();

export const Provider = ({ children }) => {
	const [value, setValue] = useState({
		city: "",
		data: undefined,
		loading: false,
		toast: useRef(null),
	});

	return (
		<Context.Provider value={{ value, setValue }}>{children}</Context.Provider>
	);
};

export default Context;
