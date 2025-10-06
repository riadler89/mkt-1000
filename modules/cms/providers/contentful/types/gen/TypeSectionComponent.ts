import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeAccordionComponentSkeleton } from "./TypeAccordionComponent";
import type { TypeButtonComponentSkeleton } from "./TypeButtonComponent";
import type { TypeDividerComponentSkeleton } from "./TypeDividerComponent";
import type { TypeGridComponentSkeleton } from "./TypeGridComponent";
import type { TypeImageComponentSkeleton } from "./TypeImageComponent";
import type { TypeLinkComponentSkeleton } from "./TypeLinkComponent";
import type { TypeRichTextComponentSkeleton } from "./TypeRichTextComponent";
import type { TypeSliderComponentSkeleton } from "./TypeSliderComponent";
import type { TypeTextComponentSkeleton } from "./TypeTextComponent";
import type { TypeVideoComponentSkeleton } from "./TypeVideoComponent";

export interface TypeSectionComponentFields {
    name: EntryFieldTypes.Symbol;
    backgroundColor?: EntryFieldTypes.Symbol;
    backgroundImageDesktop?: EntryFieldTypes.AssetLink;
    backgroundImageMobile?: EntryFieldTypes.AssetLink;
    padding?: EntryFieldTypes.Symbol<"large" | "medium" | "none" | "small">;
    minHeightDesktop?: EntryFieldTypes.Integer;
    minHeightMobile?: EntryFieldTypes.Integer;
    verticalContentAlignment?: EntryFieldTypes.Symbol<"Bottom" | "Middle" | "Top">;
    horizontalContentAlignment?: EntryFieldTypes.Symbol<"Center" | "Left" | "Right">;
    content?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAccordionComponentSkeleton | TypeButtonComponentSkeleton | TypeDividerComponentSkeleton | TypeGridComponentSkeleton | TypeImageComponentSkeleton | TypeLinkComponentSkeleton | TypeRichTextComponentSkeleton | TypeSectionComponentSkeleton | TypeSliderComponentSkeleton | TypeTextComponentSkeleton | TypeVideoComponentSkeleton>>;
}

export type TypeSectionComponentSkeleton = EntrySkeletonType<TypeSectionComponentFields, "SectionComponent">;
export type TypeSectionComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSectionComponentSkeleton, Modifiers, Locales>;

export function isTypeSectionComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeSectionComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'SectionComponent'
}

export type TypeSectionComponentWithoutLinkResolutionResponse = TypeSectionComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeSectionComponentWithoutUnresolvableLinksResponse = TypeSectionComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeSectionComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeSectionComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeSectionComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeSectionComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeSectionComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeSectionComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
