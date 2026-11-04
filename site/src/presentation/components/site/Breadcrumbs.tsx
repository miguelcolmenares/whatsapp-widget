import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

/** The trail from the home page to the current page. The last item is the page itself and has no link. */
export function Breadcrumbs({
  items,
}: {
  /** The trail, from the home page to the current one. An item with no `href` is the current page. */
  items: readonly { label: string; href?: string }[];
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={`${item.href ?? "current"}-${item.label}`}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink
                  href={item.href}
                  className="inline-flex min-h-11 items-center md:min-h-6"
                >
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
