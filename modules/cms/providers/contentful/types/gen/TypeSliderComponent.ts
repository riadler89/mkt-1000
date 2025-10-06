import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeAccordionComponentSkeleton } from "./TypeAccordionComponent";
import type { TypeButtonComponentSkeleton } from "./TypeButtonComponent";
import type { TypeDividerComponentSkeleton } from "./TypeDividerComponent";
import type { TypeGridComponentSkeleton } from "./TypeGridComponent";
import type { TypeImageComponentSkeleton } from "./TypeImageComponent";
import type { TypeLinkComponentSkeleton } from "./TypeLinkComponent";
import type { TypeRichTextComponentSkeleton } from "./TypeRichTextComponent";
import type { TypeSectionComponentSkeleton } from "./TypeSectionComponent";
import type { TypeTextComponentSkeleton } from "./TypeTextComponent";
import type { TypeVideoComponentSkeleton } from "./TypeVideoComponent";

export interface TypeSliderComponentFields {
    name: EntryFieldTypes.Symbol;
    content?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAccordionComponentSkeleton | TypeButtonComponentSkeleton | TypeDividerComponentSkeleton | TypeGridComponentSkeleton | TypeImageComponentSkeleton | TypeLinkComponentSkeleton | TypeRichTextComponentSkeleton | TypeSectionComponentSkeleton | TypeSliderComponentSkeleton | TypeTextComponentSkeleton | TypeVideoComponentSkeleton>>;
    showNavigationArrows?: EntryFieldTypes.Boolean;
    showPaginationIndicators?: EntryFieldTypes.Boolean;
}

export type TypeSliderComponentSkeleton = EntrySkeletonType<TypeSliderComponentFields, "SliderComponent">;
export type TypeSliderComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSliderComponentSkeleton, Modifiers, Locales>;

export function isTypeSliderComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeSliderComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'SliderComponent'
}

export type TypeSliderComponentWithoutLinkResolutionResponse = TypeSliderComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeSliderComponentWithoutUnresolvableLinksResponse = TypeSliderComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeSliderComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeSliderComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeSliderComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeSliderComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeSliderComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeSliderComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
