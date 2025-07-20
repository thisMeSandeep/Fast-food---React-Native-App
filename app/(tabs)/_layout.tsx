import React from "react";
import { Redirect, Slot } from "expo-router";

const TabLayout = () => {
  const isAuthenticated = true;

  if (!isAuthenticated) return <Redirect href="/sign-in" />;

  return <Slot />;
};

export default TabLayout;
