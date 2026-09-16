"use client";

import { FaCity } from "react-icons/fa";
import TravelSelectField from "./TravelSelectField";

export default function CitySelect({ allCities, currentLang, city, setCity, t }) {
  const options = allCities.map((cityItem) => {
    const name = cityItem.name?.[currentLang] || cityItem.name?.en || cityItem.name;
    return { value: name, label: name };
  });

  return (
    <TravelSelectField
      label={t("SelectCity")}
      value={city}
      onChange={setCity}
      options={options}
      icon={<FaCity aria-hidden="true" />}
    />
  );
}
