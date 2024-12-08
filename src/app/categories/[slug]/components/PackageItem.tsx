import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { PackageInfo } from "@/app/types/categories";

import { NPMIcon } from "@/assets/index";
import GithubIcon from "@/assets/github-icon.svg";
import GlobalAltIcon from "@/assets/global-alt.svg";
import dayjs from "dayjs";

interface Props {
  info: PackageInfo;
}

export default function PackageItem(props: Props) {
  const { name, description, npm, website, github } = props.info;

  const renderUrlList = () => {
    const list = [
      {
        name: npm.name,
        key: "npm",
        icon: NPMIcon,
        iconWidth: 40,
        url: npm.url,
      },
      {
        name: github.url.split("https://github.com/")[1] || name + " | npm",
        key: "github",
        icon: GithubIcon,
        iconHeight: 20,
        url: github.url,
      },
      {
        name: "Website",
        key: "website",
        icon: GlobalAltIcon,
        iconHeight: 20,
        url: website,
      },
    ];

    return (
      <div className="flex flex-wrap gap-x-4 items-center mt-6">
        {list.map((item, idx) => (
          <Link
            href={item.url}
            key={idx}
            target="_blank"
            className="flex gap-2 px-3 py-1 rounded-md hover:bg-amber-100"
          >
            <Image
              className="text-slate-600"
              src={item.icon}
              alt={item.name}
              width={item.iconWidth}
              height={item.iconHeight}
            />
            <div>{item.name}</div>
          </Link>
        ))}
      </div>
    );
  };

  const renderTags = () => {
    const tags = [
      {
        label: "Downloads",
        value: npm.downloads.toLocaleString(),
      },
      {
        label: "Stars",
        value: github.stars.toLocaleString(),
      },
      // {
      //   label: 'Issus closure rate',
      //   value:
      //     ((github.issusResolved / github.issusTotal) * 100).toFixed(2) + '%',
      // },
      {
        label: "Age",
        value: dayjs(npm.firstReleased).toNow(true),
      },
      {
        label: "Last release",
        value: dayjs(npm.lastReleased).toNow(true),
      },
    ];

    return (
      <div className="flex gap-x-6 mt-6 justify-around overflow-y-auto">
        {tags.map((item) => (
          <div
            className="flex flex-col justify-center items-center flex-shrink-0"
            key={item.label}
          >
            <div className="font-semibold text-lg">{item.label}</div>
            <div className="text-md">{item.value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-4 text-slate-600">
      <div className="text-2xl ">{name}</div>
      <div className="mt-1">{description}</div>

      {renderUrlList()}

      {renderTags()}
    </Card>
  );
}
