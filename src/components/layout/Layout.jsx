import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "primereact/toast";

import Navbar from "../comp/navbar/Navbar";
import Footer from "../comp/footer/Footer";
import Wrap from "../comp/wrap/Wrap";

import Context from "../../main/Context";

const Layout = () => {
	const { i18n, t } = useTranslation();

	const { value } = useContext(Context);

	return (
		<div className="w-full h-full flex items-center justify-center flex-col">
			<Toast ref={value.toast} position="top-center" />
			<Navbar />
			<Wrap />
			<Footer />
		</div>
	);
};

export default Layout;
