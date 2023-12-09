import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Sticky from "react-sticky-el";
import { useWindowSize } from "react-use";

import { SearchBarInput } from "@/components/form/SearchBar";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { useSlashFocus } from "@/components/player/hooks/useSlashFocus";
import { HeroTitle } from "@/components/text/HeroTitle";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRandomTranslation } from "@/hooks/useRandomTranslation";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { useBannerSize } from "@/stores/banner";

export interface HeroPartProps {
  setIsSticky: (val: boolean) => void;
  searchParams: ReturnType<typeof useSearchQuery>;
}

export function HeroPart({ setIsSticky, searchParams }: HeroPartProps) {
  const { t: randomT } = useRandomTranslation();
  const { t } = useTranslation();
  const [search, setSearch, setSearchUnFocus] = searchParams;
  const [, setShowBg] = useState(false);
  const bannerSize = useBannerSize();
  const stickStateChanged = useCallback(
    (isFixed) => {
      setShowBg(isFixed);
      setIsSticky(isFixed);
    },
    [setShowBg, setIsSticky]
  );

  const { width: windowWidth } = useWindowSize();

  const topSpacing = 16;
  const [stickyOffset, setStickyOffset] = useState(topSpacing);
  useEffect(() => {
    if (windowWidth > 1200) {
      // On large screens the bar goes inline with the nav elements
      setStickyOffset(topSpacing);
    } else {
      // On smaller screens the bar goes below the nav elements
      setStickyOffset(topSpacing + 60);
    }
  }, [windowWidth]);

  let time = "night";
  const hour = new Date().getHours();
  if (hour < 12) time = "morning";
  else if (hour < 19) time = "day";

  const title = randomT(`home.titles.${time}`);

  const inputRef = useRef<HTMLInputElement>(null);
  useSlashFocus(inputRef);

  return (
    <ThinContainer>
      <div className="mt-44 space-y-16 text-center">
        <div className="relative z-10 mb-16">
          <HeroTitle className="mx-auto max-w-md">{title}</HeroTitle>
        </div>
        <div className="relative h-20 z-30">
          <Sticky
            topOffset={stickyOffset * -1 + bannerSize}
            stickyStyle={{
              paddingTop: `${stickyOffset + bannerSize}px`,
            }}
            onFixedToggle={stickStateChanged}
          >
            <SearchBarInput
              ref={inputRef}
              onChange={setSearch}
              value={search}
              onUnFocus={setSearchUnFocus}
              placeholder={t("home.search.placeholder") ?? ""}
            />
          </Sticky>
        </div>
      </div>
    </ThinContainer>
  );
}
