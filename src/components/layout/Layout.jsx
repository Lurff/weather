import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "primereact/toast";

import Navbar from "../comp/navbar/Navbar";

const Layout = () => {
	const { i18n, t } = useTranslation();

	const [data, setData] = useState();

	const ToastRef = useRef(null);

	useEffect(() => {
		const GetDataFromAPI = async () => {
			const data = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${"Sakarya"}&appid=${
					import.meta.env.VITE_API_KEY
				}&units=metric&lang=${i18n.language}`
			);

			if (!data.ok)
				return ToastRef.current.show({
					severity: "error",
					summary: t("toast_city_error.title"),
					detail: t("toast_city_error.description"),
				});

			const response = data.json();
			return response;
		};

		GetDataFromAPI().then((res) => {
			setData(res);
		});
	}, []);

	return (
		<div className="w-full h-full">
			<Toast ref={ToastRef} position="top-center" />
			<Navbar />
		</div>
	);
};

export default Layout;
