import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";

import { useTranslation } from "react-i18next";

import Usa from "../../../locales/en-US/Usa";
import Turkey from "../../../locales/tr-TR/Turkey";

import "primereact/resources/themes/lara-dark-purple/theme.css";

const Navbar = () => {
	const { t, i18n } = useTranslation();
	const [city, setCity] = useState("");

	const Options = [
		{
			label: "Turkey",
			value: "tr-TR",
			icon: <Turkey />,
		},
		{
			label: "English",
			value: "en-US",
			icon: <Usa />,
		},
	];

	const itemTemplate = (option) => {
		return (
			<div className="flex items-center gap-2">
				{option.icon}
				<span>{option.label}</span>
			</div>
		);
	};

	const valueTemplate = (option) => {
		if (!option) return null;
		return (
			<div className="flex items-center gap-2">
				{option.icon}
				<span>{option.label}</span>
			</div>
		);
	};

	const HandleText = (e) => {
		setCity(e.target.value);
	};

	const GetDataFromApi = () => {
		console.log(city);
	};

	return (
		<div className="w-full flex justify-center sticky pt-5">
			<div className="w-1/2 p-5 border border-[#555] rounded-lg gap-5 flex">
				<div className="w-full h-full flex items-center justify-center gap-5">
					<FloatLabel className="w-4/5 h-2/3 flex items-center justify-center">
						<InputText
							id="city"
							className="w-full h-full outline-0 border border-gray-300/50 bg-transparent px-3"
							onChange={HandleText}
						/>
						<label htmlFor="city">{t("navbar.input_label")}</label>
					</FloatLabel>
					<Button
						label={t("navbar.button_label")}
						severity="warning"
						raised={false}
						size="large"
						className="px-3 py-1.5"
						onClick={GetDataFromApi}
					/>
				</div>
				<Dropdown
					placeholder={t("navbar.dropdown.placeholder")}
					className="bg-transparent"
					options={Options}
					optionLabel="label"
					optionValue="value"
					value={i18n.language}
					onChange={(e) => {
						i18n.changeLanguage(e.value);
					}}
					itemTemplate={itemTemplate} // Liste öğelerini simgelerle gösterir
					valueTemplate={valueTemplate} // Seçilen öğeyi simgelerle gösterir
					panelClassName="bg-[#111] rounded-bl-md rounded-br-md active:bg-[#222] hover:bg-[#111] selected:bg-[#111]"
				/>
			</div>
		</div>
	);
};

export default Navbar;
