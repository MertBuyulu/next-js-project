"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

// TODOs
// 1 - fix double signout button in the dropdown menu - priority

const NavItemsOrderMap = {
  Desktop: {
    Logo: 0,
    Create: 1,
    SignOut: 2,
    Profile: 3,
  },
  Mobile: {
    Logo: 0,
    Profile: 1,
    Create: 2,
    SignOut: 3,
  },
};

const getOrderedNavItems = (items, viewPort) => {
  return items.sort((a, b) => {
    return (
      NavItemsOrderMap[viewPort][a.key] - NavItemsOrderMap[viewPort][b.key]
    );
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
  const onClick = customAction || defaultAction;

  return type == "link" ? (
    <Link href={href} className={className}>
      {label}
    </Link>
  ) : (
    // item is a button for third party auth
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
};

const DesktopView = ({ navItems }) => {
  const orderedNavItems = getOrderedNavItems(navItems, "Desktop");

  return (
    <div className="sm:flex hidden">
      <div className="flex gap-3 md:gap-5">
        {orderedNavItems.map(({ key, ...item }) => (
          <NavItem key={key} {...item} />
        ))}
      </div>
    </div>
  );
};

const MobileView = ({
  navItems,
  imageSrc,
  toggleDropdown,
  setToggleDropdown,
}) => {
  // spread operator creates a new copy of the original array
  const orderedNavItems = getOrderedNavItems(navItems, "Mobile");

  return (
    <div className="sm:hidden flex relative">
      <div className="flex">
        <Image
          src={imageSrc}
          width={37}
          height={37}
          className="rounded-full"
          alt="profile"
          onClick={() => setToggleDropdown((prev) => !prev)}
        />
        {toggleDropdown && (
          <div className="dropdown">
            {orderedNavItems.map(({ key, ...item }) => (
              <NavItem
                key={key}
                {...item}
                customAction={() => setToggleDropdown(false)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const View = ({ session, navItems }) => {
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const { key, ...rest } = navItems[0];
  const imageSrc = session?.user.image;
  const remainingNavItems = navItems.slice(1);
  return (
    <>
      <NavItem key={key} {...rest} />
      <DesktopView navItems={remainingNavItems} />
      <MobileView
        {...{
          imageSrc,
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
  // Local States
  const [providers, setProviders] = useState(null);
  // Constants
  const { data: session } = useSession();

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
      className: "black_btn",
      type: "link",
      authRequired: true,
    },
    SignOut: {
      label: "Sign Out",
      defaultAction: () => signOut(),
      className: "outline_btn",
      type: "button",
      authRequired: true,
    },
    Profile: {
      label: (
        <Image
          src={session?.user.image}
          alt="Profile"
          width={37}
          height={37}
          className="rounded-full"
        />
      ),
      href: "/profile",
      type: "link",
      authRequired: true,
    },
    SignIn: {
      buttons:
        providers &&
        Object.values(providers).map((provider) => ({
          label: "Sign In",
          defaultAction: () => signIn(provider.id),
          className: "black_btn",
        })),
      type: "button",
      authRequired: false,
    },
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
