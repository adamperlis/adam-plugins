import React from "react";
import {
  ActivityLogIcon,
  ArchiveIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTopRightIcon,
  AvatarIcon,
  BarChartIcon,
  CheckIcon,
  CheckboxIcon,
  ChevronDownIcon,
  CircleIcon,
  DotFilledIcon,
  FileTextIcon,
  GlobeIcon,
  GridIcon,
  LayersIcon,
  Link2Icon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  ReloadIcon,
  SquareIcon,
  TargetIcon,
} from "@radix-ui/react-icons";

// Named imports keep this study on one SVG family. Icons accompany accessible text.
const icons = {
  activity: ActivityLogIcon,
  inbox: ArchiveIcon,
  down: ArrowDownIcon,
  back: ArrowLeftIcon,
  arrow: ArrowRightIcon,
  external: ArrowTopRightIcon,
  person: AvatarIcon,
  priority: BarChartIcon,
  check: CheckIcon,
  checked: CheckboxIcon,
  chevron: ChevronDownIcon,
  pending: CircleIcon,
  dot: DotFilledIcon,
  file: FileTextIcon,
  globe: GlobeIcon,
  grid: GridIcon,
  layers: LayersIcon,
  link: Link2Icon,
  search: MagnifyingGlassIcon,
  settings: MixerHorizontalIcon,
  pause: PauseIcon,
  play: PlayIcon,
  plus: PlusIcon,
  reload: ReloadIcon,
  unchecked: SquareIcon,
  target: TargetIcon,
};
export type IconName = keyof typeof icons;
export function AppIcon({
  name,
  size = 15,
}: {
  name: IconName;
  size?: number;
}) {
  const Glyph = icons[name];
  return (
    <Glyph
      className="ui-icon"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    />
  );
}
export function WindowDots() {
  return (
    <span className="ui-window-dots" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
