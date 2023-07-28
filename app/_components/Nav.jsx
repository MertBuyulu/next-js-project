"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const NavItemsOrderMap = {
  Desktop: {
    Logo: 0,
    Create: 1,
    SignOut: 2,
    Profile: 3,
    SignIn: 1,
  },
  Mobile: {
    Logo: 0,
    Profile: 1,
    Create: 2,
    SignOut: 3,
    SignIn: 1,
  },
};

const getOrderedNavItems = (items, viewPort) => {
  return items.sort((a, b) => {
    // all sign-in buttons are treated the same
    const aKey = a.key.startsWith("SignIn") ? "SignIn" : a.key;
    const bKey = b.key.startsWith("SignIn") ? "SignIn" : b.key;
    return NavItemsOrderMap[viewPort][aKey] - NavItemsOrderMap[viewPort][bKey];
  });
};

// Subcomponents
const NavItem = ({
  label,
  href,
  type,
  className,
  defaultAction,
  customAction,
}) => {
  const handleAction = () => {
    customAction && customAction();
    defaultAction && defaultAction();
  };

  return type == "link" ? (
    <Link href={href} className={className}>
      {label}
    </Link>
  ) : (
    // item is a button for third party auth
    <button type="button" onClick={handleAction} className={className}>
      {label}
    </button>
  );
};
// just extract the map logic here from viewport components, pass viewport as props as well
const NavItems = ({ items, viewPort, extraProps = {} }) => {
  const { customAction = undefined } = extraProps;
  return (
    <>
      {items.map(({ key, className, label, ...item }) => (
        <NavItem
          {...item}
          key={key}
          label={label && label[viewPort] ? label[viewPort] : label}
          className={
            className && className[viewPort] ? className[viewPort] : className
          }
          customAction={customAction}
        />
      ))}
    </>
  );
};

const DesktopView = ({ navItems }) => {
  const orderedNavItems = getOrderedNavItems(navItems, "Desktop");

  return (
    <div className="sm:flex hidden">
      <div className="flex gap-3 md:gap-5">
        <NavItems items={orderedNavItems} viewPort="desktop" />
      </div>
    </div>
  );
};

const MobileView = ({
  session,
  navItems,
  toggleDropdown,
  setToggleDropdown,
}) => {
  // spread operator creates a new copy of the original array
  const orderedNavItems = getOrderedNavItems(navItems, "Mobile");

  return (
    <div className="sm:hidden flex relative">
      {session?.user.id ? (
        <div className="flex">
          <Image
            src={session?.user.image}
            width={37}
            height={37}
            className="rounded-full"
            alt="profile"
            onClick={() => setToggleDropdown((prev) => !prev)}
          />
          {toggleDropdown && (
            <div className="dropdown">
              <NavItems
                items={orderedNavItems}
                viewPort="mobile"
                extraProps={{ customAction: () => setToggleDropdown(false) }}
              />
            </div>
          )}
        </div>
      ) : (
        <NavItems items={orderedNavItems} viewPort="mobile" />
      )}
    </div>
  );
};

const View = ({ session, navItems }) => {
  const [toggleDropdown, setToggleDropdown] = useState(false);

  // the first element is for the logo and is displayed regardless of current session status
  const { key, ...rest } = navItems[0];
  const remainingNavItems = navItems.slice(1);

  return (
    <>
      <NavItem key={key} {...rest} />
      <DesktopView navItems={remainingNavItems} />
      <MobileView
        {...{
          session,
          toggleDropdown,
          setToggleDropdown,
        }}
        navItems={remainingNavItems}
      />
    </>
  );
};

// Main Component
const Nav = () => {
  // Constants
  const { data: session } = useSession();
  // Local States
  const [providers, setProviders] = useState(null);

  const NavItemsMap = {
    Logo: {
      label: (
        <>
          <Image
            src="/assets/images/logo.svg"
            alt="Promptopia Logo"
            width={30}
            height={30}
            className="object-contain"
          />
          <p className="logo_text">Promptopia</p>
        </>
      ),
      href: "/",
      className: "flex gap-2 flex-center",
      type: "link",
    },
    Create: {
      label: "Create Post",
      href: "/create-post",
      className: {
        desktop: "black_btn",
        mobile: "dropdown_btn",
      },
      type: "link",
      authRequired: true,
    },
    SignOut: {
      label: "Sign Out",
      defaultAction: () => signOut(),
      className: {
        desktop: "outline_btn",
        mobile: "mt-5 w-full black_btn",
      },
      type: "button",
      authRequired: true,
    },
    Profile: {
      label: {
        desktop: (
          <Image
            src={session?.user.image}
            alt="Profile"
            width={37}
            height={37}
            className="rounded-full"
          />
        ),
        mobile: "My Profile",
      },
      href: "/profile",
      className: "dropdown_link",
      type: "link",
      authRequired: true,
    },
    SignIn: { buttons: [], type: "button", authRequired: false },
  };

  useEffect(() => {
    const setUpProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setUpProviders();
  }, []);

  const generateNavItems = () => {
    const sessionStatus = session?.user.id ? true : false;

    NavItemsMap["SignIn"].buttons =
      providers &&
      Object.values(providers).map((provider) => ({
        label: "Sign In",
        defaultAction: () => signIn(provider.id),
        className: "black_btn",
      }));

    return Object.entries(NavItemsMap)
      .filter(
        ([key, item]) =>
          item.href === "/" || item.authRequired === sessionStatus
      )
      .flatMap(([key, item]) =>
        item.buttons
          ? item.buttons.map((button, buttonIndex) => ({
              key: `${key}${buttonIndex}`,
              ...button,
            }))
          : { key, ...item }
      );
  };

  const navItems = generateNavItems();

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <View {...{ session, navItems }} />
    </nav>
  );
};

export default Nav;
