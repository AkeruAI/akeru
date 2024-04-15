import FastIcon from "../icons/fast-icon";

type HomeCardProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

function HomeCard({ title, description, icon }: HomeCardProps) {
  return (
    <article className="border border-white border-opacity-50 py-7 px-5 rounded-lg xl:py-6 lg:py-5  md:lg:py-3.5">
      <div className="flex justify-between items-center mb-2.5">
        <div>
          <p className="font-montserrat font-bold lg:text-sm">{title}</p>
        </div>
        <div>
          <FastIcon />
        </div>
      </div>
      <p className="font-montserrat text-xs opacity-70 ">{description}</p>
    </article>
  );
}

export default HomeCard;
