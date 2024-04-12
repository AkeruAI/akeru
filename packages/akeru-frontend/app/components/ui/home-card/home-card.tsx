import FastIcon from "../icons/fast-icon";

type HomeCardProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

function HomeCard({ title, description, icon }: HomeCardProps) {
  return (
    <article className="border-[1px] py-[30px] px-[22px] rounded-[10px] xl:py-[24px] lg:py-[20px]  md:lg:py-[15px]">
      <div className="flex justify-between items-center mb-[10px]">
        <div>
          <p className="font-montserrat font-[700] lg:text-[14px]">{title}</p>
        </div>
        <div>
          <FastIcon />
        </div>
      </div>
      <p className="font-montserrat text-[12px] opacity-70 lg:text-[11px] md:text-[10px]">{description}</p>
    </article>
  );
}

export default HomeCard;
