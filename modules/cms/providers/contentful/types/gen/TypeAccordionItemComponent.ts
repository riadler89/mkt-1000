import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeAccordionComponentSkeleton } from "./TypeAccordionComponent";
import type { TypeButtonComponentSkeleton } from "./TypeButtonComponent";
import type { TypeDividerComponentSkeleton } from "./TypeDividerComponent";
import type { TypeGridComponentSkeleton } from "./TypeGridComponent";
import type { TypeImageComponentSkeleton } from "./TypeImageComponent";
import type { TypeLinkComponentSkeleton } from "./TypeLinkComponent";
import type { TypeRichTextComponentSkeleton } from "./TypeRichTextComponent";
import type { TypeSectionComponentSkeleton } from "./TypeSectionComponent";
import type { TypeSliderComponentSkeleton } from "./TypeSliderComponent";
import type { TypeTextComponentSkeleton } from "./TypeTextComponent";
import type { TypeVideoComponentSkeleton } from "./TypeVideoComponent";

export interface TypeAccordionItemComponentFields {
    title: EntryFieldTypes.Symbol;
    content?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAccordionComponentSkeleton | TypeButtonComponentSkeleton | TypeDividerComponentSkeleton | TypeGridComponentSkeleton | TypeImageComponentSkeleton | TypeLinkComponentSkeleton | TypeRichTextComponentSkeleton | TypeSectionComponentSkeleton | TypeSliderComponentSkeleton | TypeTextComponentSkeleton | TypeVideoComponentSkeleton>>;
}

export type TypeAccordionItemComponentSkeleton = EntrySkeletonType<TypeAccordionItemComponentFields, "AccordionItemComponent">;
export type TypeAccordionItemComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeAccordionItemComponentSkeleton, Modifiers, Locales>;

export function isTypeAccordionItemComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeAccordionItemComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'AccordionItemComponent'
}

export type TypeAccordionItemComponentWithoutLinkResolutionResponse = TypeAccordionItemComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeAccordionItemComponentWithoutUnresolvableLinksResponse = TypeAccordionItemComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeAccordionItemComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeAccordionItemComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeAccordionItemComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeAccordionItemComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeAccordionItemComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeAccordionItemComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
