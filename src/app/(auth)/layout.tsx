import { ReadonlyURLSearchParams } from "next/navigation";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <div className="mt-40 flex justify-center items-center">{children}</div>;
};

export default layout;
