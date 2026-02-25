import { AnchorHTMLAttributes, MouseEvent, ReactNode, useEffect, useMemo, useState } from "react";

function getCurrentPath() {
  return window.location.pathname || "/";
}

function navigate(to: string) {
  if (to !== getCurrentPath()) {
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
}

export function useLocation(): [string, (to: string) => void] {
  const [location, setLocation] = useState(getCurrentPath);

  useEffect(() => {
    const onPopState = () => setLocation(getCurrentPath());
    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return useMemo(() => [location, navigate], [location]);
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

export function Link({ href, onClick, children, ...rest }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      rest.target === "_blank"
    ) {
      return;
    }

    event.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

type RouteProps = {
  path: string;
  component: () => JSX.Element;
};

export function Route({ path, component: Component }: RouteProps) {
  const [location] = useLocation();
  return location === path ? <Component /> : null;
}

export function Switch({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
