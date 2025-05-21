import { useAuth } from "../../authentication/use-auth";
import { createStyles } from "@mantine/emotion";
import { Button, Card, CardSection, Text } from "@mantine/core";
import {useNavigate } from "react-router-dom";
import { routes } from "../../routes";

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.wrapper}>
      <div className={classes.column}>
        {/* LEFT COLUMN */}
        <div className={classes.column1}>
          <Text className={classes.mediumText}>The first </Text>
          <Text className={classes.bigText}>AI Mock Interview </Text>
          <Text className={classes.mediumText}>for Students</Text>
          <div style={{marginTop:"25px", alignItems:"center", justifyContent:"center"}}>
            <Button className={classes.button} variant="outline" onClick={()=> navigate(routes.interacting)}>
            Let's Begin
          </Button>
          </div>
          
        </div>

        {/* RIGHT COLUMN */}
        <div className={classes.cardsContainer}>
          {[1, 2,3,4].map((card, index) => (
            <Card key={index} className={classes.card}>
              <CardSection className={classes.cardSection}>
                <Text>Innovative Design Award</Text>
                <Text>People love it!</Text>
              </CardSection>
              <CardSection className={classes.cardSection}>
                <Text>Great UX</Text>
                <Text>Students approved</Text>
              </CardSection>
            </Card>
            
          ))}
        </div>
      </div>
    </div>
  );
};
const useStyles = createStyles(() => {
  return {
    wrapper: {
      minHeight: '100%',
    },

    column: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "3rem",
      flexWrap: "wrap",
    },

    column1: {
      flex: 1,
      height: '670px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '2rem',
    },

    cardsContainer: {
      flex: 1,
      display: "flex",
      gap: "2rem",
      justifyContent: "center",
      flexWrap: "wrap",
    },

    mediumText: {
      fontSize: '3rem',
      background: 'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)',
      fontWeight: 640,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },

    bigText: {
      fontSize: '4rem',
      background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
      fontWeight: 700,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },

    card: {
      width: "300px",
      height: "300px",
      borderRadius: "1.5rem",
      overflow: "hidden",
       background: "rgba(255, 255, 255, 0.05)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      boxShadow: `
        0 8px 20px rgba(0, 0, 0, 0.1),
        0 12px 28px rgba(0, 0, 0, 0.2)
      `,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px) scale(1.03)",
        boxShadow: `
          0 12px 24px rgba(0, 0, 0, 0.2),
          0 20px 40px rgba(0, 0, 0, 0.25)
        `,
        cursor: "pointer",
      },
    },

    cardSection: {
      flex: 1,
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      borderBottom: "1px solid #eaeaea",
      "&:last-of-type": {
        borderBottom: "none",
      },
    },
    button:{
        borderRadius: "3rem",


    }
  };
});

