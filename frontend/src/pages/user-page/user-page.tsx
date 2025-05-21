import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth, useUser } from "../../authentication/use-auth";
import { ActionIcon, Avatar, Box, Button, Container, FileButton, Group, Text, TextInput, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import {
  faUser,
  faScaleBalanced,
  faBullseye,
  faEdit,
  faSave,
  faCamera,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { createStyles } from "@mantine/emotion";
import { UserUpdateDto } from "../../constants/types";
import api from "../../config/axios";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";


function ProfilePicture() {
  const user = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
    0
  )}`.toUpperCase();
  const handleFileChange = (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      console.log("Selected file:", file);
    }
  };

  return (
    <Group justify="center" pos="relative" mb="xl">
      {previewUrl ? (
        <Avatar src={previewUrl} alt={fullName} size={100} radius="xl" />
      ) : (
        <Avatar color="#52aead" size={100} radius="xl">
          {initials}
        </Avatar>
      )}

      <FileButton
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/gif"
      >
        {(props) => (
          <ActionIcon
            {...props}
            variant="filled"
            color="#008b84"
            radius="xl"
            size="sm"
            pos="absolute"
            bottom={0}
            right={0}
          >
            <FontAwesomeIcon icon={faCamera} size="xs" color="white" />
          </ActionIcon>
        )}
      </FileButton>
    </Group>
  );
}

export const UserPage = () => {
  const { user, logout } = useAuth();
  const {classes} = useStyles();
    const [isEditing, setIsEditing] = useState(false);
      const theme = useMantineTheme();
        const [editedUser, setEditedUser] = useState<UserUpdateDto>({
             firstName: user?.firstName ?? "",
             lastName: user?.lastName ?? "",
        });

      const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const currentDateTime = new Date().toISOString();

      const updatedUserData = {
        ...user,
        updatedDate: currentDateTime,
      };
      const response = await api.put(`/api/users/${user?.id}`, updatedUserData);

      if (response.status === 200) {
        notifications.show({
          title: "Success!",
          message: "Your profile has been updated",
          color: "teal",
          icon: <IconCheck />,
        });

        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update profile",
        color: "red",
      });
      console.error("Profile update error:", error);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    });
    setIsEditing(false);
  };
  
  return (
    <div>
      <Container>
         <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems:"center"
                }}
              >
                <ProfilePicture />
              </Box>
              <Text fw={600} size="sm" color="dimmed" style={{display:"flex", justifyContent:"center"}}>
                  Personal Information
                </Text>

                <div className={classes.infoRow}>
                  <Text className={classes.infoLabel}>First Name:</Text>
                  {isEditing ? (
                    <TextInput
                      value={user?.firstName}
                    //   onChange={(e) =>
                    //     handleChange("firstName", e.target.value)
                    //   }
                      className={classes.editInput}
                    />
                  ) : (
                    <Text className={classes.infoValue}>{user?.firstName}</Text>
                  )}
                </div>

                <div className={classes.infoRow}>
                  <Text className={classes.infoLabel}>Last Name:</Text>
                  {isEditing ? (
                    <TextInput
                      value={user?.lastName}
                    //   onChange={(e) => handleChange("lastName", e.target.value)}
                      className={classes.editInput}
                    />
                  ) : (
                    <Text className={classes.infoValue}>{user?.lastName}</Text>
                  )}
                </div>
      </Container>
    </div>
  );
};

const useStyles = createStyles((theme) => {
  const { colorScheme } = useMantineColorScheme();
  return {
      infoRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: `${theme.spacing.xs} ${theme.spacing.md}`,
      // "&:nth-of-type(odd)": {
      //   backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      // },
    },
    infoLabel: {
      fontWeight: 600,
      // color: theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[7],
    },
    infoValue: {
      textAlign: "right",
    },
    editInput: {
      flex: 1,
      maxWidth: "200px",
    },
}});