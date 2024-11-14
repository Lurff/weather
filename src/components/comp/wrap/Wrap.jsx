import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";

import Context from "../../../main/Context";

const Wrap = () => {
	const { value, setValue } = useContext(Context);
	const { i18n, t } = useTranslation();

	const FormatData = (timestamp) => {
		const date = new Date(timestamp * 1000);
		const time = date.toLocaleTimeString(i18n.language, {
			hour: "2-digit",
			minute: "2-digit",
		});
		return time;
	};

	const GetDataFromApi = async (long, lat) => {
		setValue((v) => ({ ...v, loading: true }));
		await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${
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
			});
		// .catch(() => {
		// 	setValue((v) => ({ ...v, loading: false }));
		// 	return value.toast.current.show({
		// 		severity: "error",
		// 		summary: t("toast_city_error.title"),
		// 		detail: t("toast_city_error.description"),
		// 	});
		// });
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

	const HandleClick = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async (position) => {
				const long = position.coords.longitude;
				const lat = position.coords.latitude;
				GetDataFromApi(long, lat);
			});
		}
	};

	const CarouselTemplate = (option) => {
		return (
			<div className="w-fit flex-col flex items-center justify-center p-3">
				<div className="w-fit flex items-center justify-center flex-col">
					<img
						draggable={false}
						className="w-24"
						src={`https://openweathermap.org/img/wn/${option.weather[0].icon}@2x.png`}
					/>
					<span className="text-wrap text-center">
						{option.weather[0].description.charAt(0).toUpperCase() +
							option.weather[0].description.slice(1)}
					</span>
					<span className="text-lg">{FormatData(option.dt)}</span>
				</div>
				<div className="w-fit flex items-center justify-center gap-1">
					<span>{Math.round(option.main.temp_min)}°C</span>
					<span>/</span>
					<span>{Math.round(option.main.temp_max)}°C</span>
				</div>
			</div>
		);
	};

	return (
		<div className="w-1/2 min-h-full flex items-center justify-center flex-row max-lg:w-3/4 max-lg:flex-col max-lg:gap-5 m-5">
			{(value.data && (
				<div className="w-full flex flex-col items-center gap-5">
					<div className="w-full flex flex-col items-center gap-5 max-lg:flex-col">
						<h1 className="text-5xl font-extrabold max-lg:text-wrap max-lg:text-center">
							{value.data.name},{value.data.sys.country}
						</h1>
						<div className="w-full flex items-center justify-center max-lg:flex-col">
							<div className="w-1/3 flex items-center justify-center gap-5 text-nowrap">
								<div className="flex flex-col justify-center text-lg items-center">
									<span className="font-medium">{t("wrap.sunrise")}</span>
									<span>{FormatData(value.data.sys.sunrise)}</span>
								</div>
								<div className="flex flex-col justify-center text-lg items-center text-nowrap">
									<span className="font-medium">{t("wrap.sunset")}</span>
									<span>{FormatData(value.data.sys.sunset)}</span>
								</div>
							</div>
							<div className="w-1/3 flex items-center justify-center">
								<img
									draggable={false}
									src={`https://openweathermap.org/img/wn/${value.data.weather[0].icon}@2x.png`}
								/>
								<span className="text-lg font-medium text-nowrap">
									{value.data.weather[0].description.charAt(0).toUpperCase() +
										value.data.weather[0].description.slice(1)}
								</span>
							</div>
						</div>
						<div className="w-full flex items-center justify-center max-lg:flex-col">
							<div className="w-fit flex items-center justify-center gap-5 max-lg:flex-wrap">
								<div className="flex flex-col justify-center items-center text-lg text-nowrap">
									<span className="font-medium">{t("wrap.feels_like")}</span>
									<span>
										{value.data.main.feels_like.toString().split(".")[0]}°C
									</span>
								</div>
								<div className="flex flex-col justify-center items-center text-lg text-nowrap">
									<span className="font-medium">{t("wrap.temp")}</span>
									<div className="w-fit flex items-center justify-center gap-1">
										<span>{Math.round(value.data.main.temp_min)}°C</span>
										<span>/</span>
										<span>{Math.round(value.data.main.temp_max)}°C</span>
									</div>
								</div>
								<div className="flex flex-col justify-center items-center text-lg text-nowrap">
									<span className="font-medium">{t("wrap.humidity")}</span>
									<span>{value.data.main.humidity}</span>
								</div>
								<div className="flex flex-col justify-center items-center text-lg text-nowrap">
									<span className="font-medium">{t("wrap.wind.speed")}</span>
									<span>{value.data.wind.speed} Km/h</span>
								</div>
								<div className="flex flex-col justify-center items-center text-lg text-nowrap">
									<span className="font-medium">{t("wrap.wind.deg")}</span>
									<span>{value.data.wind.deg}°</span>
								</div>
							</div>
						</div>
						<div className="w-full flex items-center justify-center max-lg:flex-col">
							<div className="w-fit flex items-center justify-center gap-3 max-lg:flex-wrap">
								<div className="flex flex-col justify-center text-lg items-center">
									<span className="font-medium">{t("wrap.long")}</span>
									<span>{value.data.coord.lon}</span>
								</div>
								<div className="flex flex-col justify-center text-lg items-center">
									<span className="font-medium">{t("wrap.lat")}</span>
									<span>{value.data.coord.lat}</span>
								</div>
								<div className="flex flex-col justify-center text-lg items-center">
									<span className="font-medium">
										{t("wrap.grounded_level")}
									</span>
									<span>{value.data.main.grnd_level}</span>
								</div>
								<div className="flex flex-col justify-center text-lg items-center">
									<span className="font-medium">{t("wrap.sea_level")}</span>
									<span>{value.data.main.sea_level}</span>
								</div>
								<div className="flex flex-col justify-center items-center text-lg text-nowrap">
									<span className="font-medium">{t("wrap.pressure")}</span>
									<span>{value.data.main.pressure}</span>
								</div>
							</div>
						</div>
					</div>
					<div className="w-full flex items-center justify-center flex-col gap-5">
						<h1 className="text-5xl font-extrabold max-lg:text-center">
							{t("wrap.15_day_weather_report.title")}
						</h1>
						<Carousel
							itemTemplate={CarouselTemplate}
							numScroll={3}
							numVisible={5}
							value={value.daily.data}
							className="w-full flex gap-5"
							responsiveOptions={[
								{ numVisible: 1, numScroll: 1, breakpoint: "480px" },
								{ numVisible: 2, numScroll: 1, breakpoint: "768px" },
								{ numVisible: 3, numScroll: 1, breakpoint: "1024px" },
								{ numVisible: 5, numScroll: 3, breakpoint: "1200px" },
							]}
						/>
					</div>
				</div>
			)) || (
				<div className="w-full h-full flex flex-col items-center justify-center gap-5 m-5">
					<div className="w-full flex justify-center flex-col gap-3">
						<h1 className="text-5xl font-extrabold max-lg:text-center">
							{t("wrap.title")}
						</h1>
						<span className="text-lg indent-6 w-full font-semibold max-lg:text-center">
							{t("wrap.description")}
						</span>
					</div>
					<div className="w-full flex items-center justify-start max-lg:justify-center">
						<Button
							label={t("wrap.button")}
							raised={true}
							size="large"
							className="px-3 py-1.5 bg-violet-800/50 hover:bg-violet-900 text-nowrap"
							onClick={HandleClick}
							loading={value.loading}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Wrap;
