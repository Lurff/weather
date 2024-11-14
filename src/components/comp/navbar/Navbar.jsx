import React, { useContext } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";

import { useTranslation } from "react-i18next";

import Usa from "../../../locales/en-US/Usa";
import Turkey from "../../../locales/tr-TR/Turkey";

import Context from "../../../main/Context";

const Navbar = () => {
	const { t, i18n } = useTranslation();

	const { value, setValue } = useContext(Context);

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
		setValue((v) => ({ ...v, city: e.target.value }));
	};

	const GetDataFromApi = async () => {
		setValue((v) => ({ ...v, loading: true }));
		await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${value.city}&appid=${
				import.meta.env.VITE_API_KEY
			}&units=metric&lang=${i18n.language.split("-")[0]}`
		)
			.then((res) => {
				if (!res.ok) {
					setValue((v) => ({ ...v, loading: false }));

					return value.toast.current.show({
						severity: "error",
						summary: t("toast_city_error.title"),
						detail: t("toast_city_error.description"),
					});
				}
				return res.json();
			})
			.then((response) => {
				setValue((v) => ({ ...v, data: response, loading: false }));
				Get15DayWeatherReport(response.name);
			})
			.catch(() => {
				setValue((v) => ({ ...v, loading: false }));
				return value.toast.current.show({
					severity: "error",
					summary: t("toast_city_error.title"),
					detail: t("toast_city_error.description"),
				});
			});
	};

	const Get15DayWeatherReport = async (cityName) => {
		setValue((v) => ({ ...v, daily: { ...v.daily, loading: true } }));
		await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${
				import.meta.env.VITE_API_KEY
			}&lang=${i18n.language.split("-")[0]}`
		)
			.then((res) => res.json())
			.then((response) =>
				setValue((v) => ({
					...v,
					daily: { data: response.list, loading: false },
				}))
			)
			.catch(() => {
				setValue((v) => ({ ...v, daily: { ...v.daily, loading: false } }));
				return value.toast.current.show({
					severity: "error",
					summary: t("toast_city_error.title"),
					detail: t("toast_city_error.description"),
				});
			});
	};

	return (
		<div className="w-full flex justify-center sticky pt-5">
			<div className="w-1/2 max-lg:w-3/4 p-5 border border-[#555] rounded-lg gap-5 flex">
				<div className="w-full h-full flex items-center justify-center gap-5">
					<FloatLabel className="w-4/5 h-2/3 flex items-center justify-center">
						<InputText
							value={value.city}
							id="city"
							className="w-full h-full outline-0 border border-gray-300/50 bg-transparent px-3"
							onChange={HandleText}
							onKeyUp={(e) => e.key == "Enter" && GetDataFromApi()}
						/>
						<label htmlFor="city">{t("navbar.input_label")}</label>
					</FloatLabel>
					<Button
						label={t("navbar.button_label")}
						raised={true}
						size="large"
						className="px-3 py-1.5 bg-violet-800/50 hover:bg-violet-900 max-lg:px-2 max-lg:py-1 text-center"
						onClick={GetDataFromApi}
						disabled={!value.city.length > 0}
						loading={value.loading}
					/>
				</div>
				<Dropdown
					placeholder={t("navbar.dropdown.placeholder")}
					className="bg-transparent max-lg:hidden"
					options={Options}
					optionLabel="label"
					optionValue="value"
					value={i18n.language}
					onChange={(e) => i18n.changeLanguage(e.value)}
					itemTemplate={itemTemplate}
					valueTemplate={valueTemplate}
					panelClassName="bg-[#111] rounded-bl-md rounded-br-md active:bg-[#222] hover:bg-[#111] selected:bg-[#111]"
				/>
			</div>
		</div>
	);
};

export default Navbar;
