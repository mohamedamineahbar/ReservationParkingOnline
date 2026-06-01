import { Box, Typography } from "@mui/material";

const Footer = () => (
    <Box
        component="footer"
        sx={{
            py: 2,
            px: 2,
            mt: "auto",
            backgroundColor: "rgb(37,99,235)",
            color: "white",
            textAlign: "center",
        }}
    >
        <Typography variant="body2">
            &copy; {new Date().getFullYear()} eParking Bitola. All rights reserved.
        </Typography>
    </Box>
);

export default Footer;
