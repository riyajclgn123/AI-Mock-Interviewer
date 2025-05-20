import { routes } from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
    Menu,
    Image,
    Container,
    Group,
    useMantineColorScheme,
    Button,
    Flex,
    Text,
    Avatar,
    Title,
    Divider,
    useMantineTheme,
    MantineTheme,
} from "@mantine/core";
import {
    NAVBAR_HEIGHT,
    NAVBAR_HEIGHT_NUMBER,
    PRIMARY_COLOR_GREEN,
} from "../../constants/theme-constants";
import {
    NavLink,
    NavLinkProps,
    useLocation,
    useNavigate,
} from "react-router-dom";
import logo from "../../assets/logodone.png";
import { UserDto } from "../../constants/types";
import { useAuth } from "../../authentication/use-auth";

import { useEffect, useState } from "react";

type PrimaryNavigationProps = {
    user?: UserDto;
};

type NavigationItem = {
    text: string;
    icon?: IconProp | undefined;
    hide?: boolean;
} & (
    | {
          nav: Omit<
              NavLinkProps,
              keyof React.AnchorHTMLAttributes<HTMLAnchorElement>
          >;
          children?: never;
      }
    | { nav?: never; children: NavigationItemForceNav[] }
);

export type NavigationItemForceNav = {
    text: string;
    icon?: IconProp | undefined;
    hide?: boolean;
    nav: NavLinkProps;
};

const navigation: NavigationItem[] = [
    {
        text: "Dashboard",
        hide: false,
        nav: {
            to: routes.home,
        },
    },
    // {
    //   text: "User",
    //   hide: false,
    //   nav: {
    //     to: routes.user,
    //   },
    // },
];

const DesktopNavigation = () => {
    const { pathname } = useLocation();
    const [active, setActive] = useState(navigation[0].nav?.to.toString());

    useEffect(() => {
        setActive(pathname);
    }, [pathname, setActive]);

    const desktopNavStyles = {
        root: {
            height: NAVBAR_HEIGHT,
            color: "black",
        },
    };

    const fullHeight = {
        root: {
            height: "100%",
        },
    };

    const paddedMenuItem = {
        root: {
            position: "relative" as const,
            margin: "0px 5px",
            color: "#ced4da",
            textDecoration: "none",
            overflow: "hidden",
            transition: "color 0.3s ease",

            "&::after": {
                content: '""',
                position: "absolute" as const,
                bottom: 0,
                left: 0,
                width: "100%",
                height: "2px",
                backgroundColor: "#52aead",
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.3s ease-in-out",
            },

            "&:hover": {
                backgroundColor: "transparent",
                "&::after": {
                    transform: "scaleX(1.3)",
                },
            },
        },
    };

    const linkActive = (theme: MantineTheme) => ({
        "&, &:hover": {
            backgroundColor: "white",
            color: theme.variantColorResolver({
                theme: theme,
                color: "black",
                variant: "light",
            }).color,
        },
    });

    return (
        <>
            <Container px={0} styles={desktopNavStyles}>
                <Flex direction="row" align="center" styles={fullHeight}>
                    {navigation
                        .filter((x) => !x.hide)
                        .map((x, i) => {
                            if (x.children) {
                                return (
                                    <Menu trigger="hover" key={i}>
                                        <Menu.Target>
                                            <Button
                                                size="md"
                                                styles={paddedMenuItem}
                                                variant="subtle"
                                                key={i}
                                            >
                                                {x.icon && (
                                                    <FontAwesomeIcon
                                                        icon={x.icon}
                                                    />
                                                )}{" "}
                                                {x.text}
                                            </Button>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            {x.children
                                                .filter((x) => !x.hide)
                                                .map((y) => {
                                                    return (
                                                        <Menu.Item
                                                            key={`${y.text}`}
                                                            to={y.nav.to}
                                                            component={NavLink}
                                                        >
                                                            <Flex direction="row">
                                                                <Text size="sm">
                                                                    {y.icon && (
                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                y.icon
                                                                            }
                                                                        />
                                                                    )}{" "}
                                                                    {y.text}
                                                                </Text>
                                                            </Flex>
                                                        </Menu.Item>
                                                    );
                                                })}
                                        </Menu.Dropdown>
                                    </Menu>
                                );
                            }
                            return (
                                <Button
                                    size="md"
                                    component={NavLink}
                                    to={x.nav.to}
                                    styles={(theme) => ({
                                        root: {
                                            ...paddedMenuItem.root,
                                            ...(active === x.nav.to
                                                ? linkActive(theme)
                                                : {}),
                                        },
                                    })}
                                    variant="subtle"
                                    key={i}
                                >
                                    {x.icon && (
                                        <FontAwesomeIcon icon={x.icon} />
                                    )}{" "}
                                    {x.text}
                                </Button>
                            );
                        })}
                </Flex>
            </Container>
        </>
    );
};

export const PrimaryNavigation: React.FC<PrimaryNavigationProps> = ({
    user,
}) => {
    const { logout } = useAuth();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const dark = colorScheme === "dark";

    const logo = {
        root: {
            width: 50,
            height: 50,
            borderRadius: "50%",
            objectFit: "contain" as const,
            boxShadow: theme.shadows.md,
            transition: "transform 0.3s ease",
            marginRight: 20,
            backgroundColor: "transparent",
            "&:hover": {
                transform: "scale(1.05)",
            },
        },
    }

    const container = {
        root: {
            color: "#008b84",
        },
    };

    const pointer = {
        root: {
            cursor: "pointer",

            //border: `1px solid ${'#ffffff'}`,
            transition: "transform 0.2s ease",
            "&:hover": {
                transform: "scale(1.1)",
            },
        },
    };
    return (
        <Title styles={container} order={4}>
            <Container px={20} fluid>
                <Flex direction="row" justify="space-between" align="center">
                    <NavLink to={routes.root}>
                        <Image
                            styles={logo}
                            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                            src={logo}
                            alt="logo"
                        />
                    </NavLink>
                    <Flex justify="center" style={{ flex: 1 }}>
                        {user && <DesktopNavigation />}
                    </Flex>
                    <Group>
                        {user && (
                            <Menu>
                                <Menu.Target>
                                    <Avatar
                                        styles={pointer}
                                        color="white"
                                        style={{
                                            color: "white",
                                            backgroundColor: "#52aead",
                                        }}
                                    >
                                        {user.firstName.substring(0, 1)}
                                        {user.lastName.substring(0, 1)}
                                    </Avatar>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item
                                        onClick={() => toggleColorScheme()}
                                    >
                                        {dark ? "Light mode" : "Dark mode"}
                                    </Menu.Item>
                                    <Divider my={5} />
                                    <Menu.Item
                                        onClick={() => logout()}
                                        color="red"
                                    >
                                        Sign Out
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        )}
                    </Group>
                </Flex>
            </Container>
        </Title>
    );
};