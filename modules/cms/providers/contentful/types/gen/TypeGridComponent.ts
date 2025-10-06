import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeAccordionComponentSkeleton } from "./TypeAccordionComponent";
import type { TypeButtonComponentSkeleton } from "./TypeButtonComponent";
import type { TypeDividerComponentSkeleton } from "./TypeDividerComponent";
import type { TypeImageComponentSkeleton } from "./TypeImageComponent";
import type { TypeLinkComponentSkeleton } from "./TypeLinkComponent";
import type { TypeRichTextComponentSkeleton } from "./TypeRichTextComponent";
import type { TypeSectionComponentSkeleton } from "./TypeSectionComponent";
import type { TypeSliderComponentSkeleton } from "./TypeSliderComponent";
import type { TypeTextComponentSkeleton } from "./TypeTextComponent";
import type { TypeVideoComponentSkeleton } from "./TypeVideoComponent";

export interface TypeGridComponentFields {
    name: EntryFieldTypes.Symbol;
    numberOfColumnsDesktop: EntryFieldTypes.Integer;
    numberOfColumnsMobile: EntryFieldTypes.Integer;
    gapColumnDesktop?: EntryFieldTypes.Symbol<"large" | "medium" | "none" | "small">;
    gapColumnMobile?: EntryFieldTypes.Symbol<"large" | "medium" | "none" | "small">;
    gapRowDesktop?: EntryFieldTypes.Symbol<"large" | "medium" | "none" | "small">;
    gapRowMobile?: EntryFieldTypes.Symbol<"large" | "medium" | "none" | "small">;
    verticalContentAlignment?: EntryFieldTypes.Symbol<"Bottom" | "Middle" | "Top">;
    horizontalContentAlignment?: EntryFieldTypes.Symbol<"Center" | "Left" | "Right">;
    columnContent?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAccordionComponentSkeleton | TypeButtonComponentSkeleton | TypeDividerComponentSkeleton | TypeGridComponentSkeleton | TypeImageComponentSkeleton | TypeLinkComponentSkeleton | TypeRichTextComponentSkeleton | TypeSectionComponentSkeleton | TypeSliderComponentSkeleton | TypeTextComponentSkeleton | TypeVideoComponentSkeleton>>;
}

export type TypeGridComponentSkeleton = EntrySkeletonType<TypeGridComponentFields, "GridComponent">;
export type TypeGridComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeGridComponentSkeleton, Modifiers, Locales>;

export function isTypeGridComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeGridComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'GridComponent'
}

export type TypeGridComponentWithoutLinkResolutionResponse = TypeGridComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeGridComponentWithoutUnresolvableLinksResponse = TypeGridComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeGridComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeGridComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeGridComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeGridComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeGridComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeGridComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
