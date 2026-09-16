"use client";

import TravelSelectField from "./TravelSelectField";
import { MdCategory } from "react-icons/md";

export default function CategorySelect({ allCategories, currentLang, tripType, setTripType, t }) {
  const options = allCategories.map((category) => {
    const name = category.name?.[currentLang] || category.name?.en || category.name;
    return { value: name, label: name };
  });

  return (
    <TravelSelectField
      label={t("SelectCategory")}
      value={tripType}
      onChange={setTripType}
      options={options}
      icon={<MdCategory aria-hidden="true" />}
    />
  );
}
