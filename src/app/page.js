
// "use client";
// import { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   Box,
//   Button,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Paper,
// } from "@mui/material";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import { supabase } from "../supabase";

// import { useUser } from "./contexts/UserContext";
// import { MenuItem, Select } from "@mui/material";

// export default function SectionsDashboard() {
//   const { user } = useUser();
//   const [sections, setSections] = useState([]);
//   const [sectionCards, setSectionCards] = useState({});
//   const [selectedCard, setSelectedCard] = useState(null);
//   const [selectedOption, setSelectedOption] = useState("");
//   const [isCopCard, setIsCopCard] = useState(false);
//   // Background GIF URL (replace with your actual background GIF)
//   const backgroundGifUrl = "";

//   useEffect(() => {
//     fetchSections();
//   }, []);



//   const fetchSections = async () => {
//     try {
//       const { data: sectionsData, error: sectionsError } = await supabase
//         .from("sections")
//         .select("*")
//         .eq("is_active", true);

//       if (sectionsError) throw sectionsError;

//       const cardPromises = sectionsData.map(async (section) => {
//         const { data: cardsData } = await supabase
//           .from("section_cards")
//           .select("*")
//           .eq("section_id", section.id)
//           .eq("is_active", true);

//         return { [section.id]: cardsData || [] };
//       });

//       const cardsResults = await Promise.all(cardPromises);
//       const cardsMap = cardsResults.reduce(
//         (acc, curr) => ({ ...acc, ...curr }),
//         {}
//       );

//       setSections(sectionsData);
//       setSectionCards(cardsMap);
//     } catch (error) {
//       console.error("Error fetching sections:", error);
//     }
//   };

//   const handleCardClick = (card) => {
//     setSelectedCard(card);
//     setIsCopCard(card.title === "Download COP/DC Certificates");
//     setSelectedOption("");
//   };

//   const handleVisitCard = () => {
//     if (selectedCard?.link) {
//       window.open(selectedCard.link, "_blank");
//     }
//   };
//   const dialogContent = (
//     <Dialog
//       open={!!selectedCard}
//       onClose={() => setSelectedCard(null)}
//       fullWidth
//       maxWidth="sm"
//     >
//       <DialogTitle>{selectedCard?.title}</DialogTitle>
//       <DialogContent>
//         <Typography variant="body1" sx={{ mb: 2 }}>
//           {selectedCard?.description}
//         </Typography>
        
//         {user && isCopCard && (
//           <Select
//             fullWidth
//             value={selectedOption}
//             onChange={(e) => setSelectedOption(e.target.value)}
//             displayEmpty
//           >
//             <MenuItem value="" disabled>Select Certificate Type</MenuItem>
//             <MenuItem value="STCW Course">STCW Course</MenuItem>
//             <MenuItem value="GMDSS">GMDSS</MenuItem>
//             <MenuItem value="COP - DC ENDORSEMENTS">COP - DC ENDORSEMENTS</MenuItem>
//             <MenuItem value="COP - DC BASIC">COP - DC BASIC</MenuItem>
//             <MenuItem value="COP - IGF CODE">COP - IGF CODE</MenuItem>
//             <MenuItem value="COP - Rating [ Watch Keeping / AB / ETR ]">
//               COP - Rating [ Watch Keeping / AB / ETR ]
//             </MenuItem>
//             <MenuItem value="COP - Polar Water">COP - Polar Water</MenuItem>
//           </Select>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={() => setSelectedCard(null)}>Cancel</Button>
//         {user && isCopCard ? (
//           <Button 
//             variant="contained" 
//             onClick={() => window.open(generateDynamicLink(selectedOption), "_blank")}
//             disabled={!selectedOption}
//           >
//             Download
//           </Button>
//         ) : (
//           <Button 
//             variant="contained" 
//             onClick={handleVisitCard}
//           >
//             Visit
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );

//   const generateDynamicLink = (option) => {
//     if (!user || !option) return "";
    
//     const monthAbbreviations = [
//       "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//     ];

//     // Get current date in DD%2FMM%2FYYYY format
//     const currentDate = new Date();
//     const day = currentDate.getDate();
//     const month = currentDate.getMonth() + 1;
//     const year = currentDate.getFullYear();
//     const formattedDate = `${day}%2F${month}%2F${year}`;

//     // Get user data
//     const indosNumber = user.professional_info?.indos_number || "";
//     let dobDay = "", dobMonth = "", dobYear = "";
    
//     if (user.date_of_birth) {
//       const [y, m, d] = user.date_of_birth.split("-");
//       dobYear = y;
//       dobDay = d.startsWith("0") ? d.substring(1) : d;
//       const monthIndex = parseInt(m, 10) - 1;
//       dobMonth = monthAbbreviations[monthIndex] || "";
//     }

//     // Map options to short codes and endpoints
//     const optionConfig = {
//       "STCW Course": { 
//         code: "CRSE",
//         endpoint: "StcwCourse.jsp"
//       },
//       "GMDSS": { 
//         code: "GMDSS",
//         endpoint: "COPDetails.jsp"
//       },
//       "COP - DC ENDORSEMENTS": { 
//         code: "DC",
//         endpoint: "COPDetails.jsp"
//       },
//       "COP - DC BASIC": { 
//         code: "COP",
//         endpoint: "COPDetails.jsp"
//       },
//       "COP - IGF CODE": { 
//         code: "IGF",
//         endpoint: "COPDetails.jsp"
//       },
//       "COP - Rating [ Watch Keeping / AB / ETR ]": { 
//         code: "WK",
//         endpoint: "COPDetails.jsp"
//       },
//       "COP - Polar Water": { 
//         code: "DCPOLAR",
//         endpoint: "COPDetails.jsp"
//       }
//     };

//     const config = optionConfig[option] || { code: "", endpoint: "COPDetails.jsp" };
    
//     return `http://220.156.189.33/esamudraUI/jsp/examination/checker/${config.endpoint}?` +
//            `hidSystemDate=${formattedDate}&hidSystemDate1=&hidProcessId=&` +
//            `cmbSearch_by=${config.code}&txtNo=${indosNumber}&` +
//            `txtDob=${dobDay}%2F${dobMonth}%2F${dobYear}&certNo=`;
// };

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         minHeight: "100vh",
//         backgroundImage: `url(${backgroundGifUrl})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundAttachment: "fixed",
//         overflow: "hidden",
//       }}
//     >
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           backgroundColor: "rgba(0,0,0,0.6)",
//           zIndex: 1,
//         }}
//       />
//       <Container
//         maxWidth="lg"
//         sx={{
//           position: "relative",
//           zIndex: 2,
//           mt: 4,
//           mb: 4,
//           p: 2,
//         }}
//       >
//         {/* Sections Rendering */}
//         {sections.map((section) => (
//           <Paper
//             key={section.id}
//             elevation={3}
//             sx={{
//               mb: 4,
//               p: 3,
//               borderRadius: 2,
//               backgroundColor: "rgba(0,0,0,0.4)",
//               backdropFilter: "blur(2px)",
//               overflow: "hidden",
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 2,
//               }}
//             >
//               <Typography variant="h5" sx={{ color: "#fff" }}>
//                 {section.title}
//               </Typography>
//             </Box>

//             <Typography variant="body2" sx={{ mb: 2, color: "#e0e0e0" }}>
//               {section.description}
//             </Typography>

//             <Swiper
//               spaceBetween={16}
//               slidesPerView={1.2}
//               breakpoints={{
//                 640: { slidesPerView: 2.2 },
//                 768: { slidesPerView: 3.2 },
//               }}
//             >
//               {(sectionCards[section.id] || []).map((card) => (
//                 <SwiperSlide key={card.id}>
//                   <Paper
//                     elevation={2}
//                     sx={{
//                       p: 2,
//                       height: "200px",
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "space-between",
//                       cursor: "pointer",
//                       backgroundColor: "rgba(0,0,0,0.4)",
//                       backdropFilter: "blur(5px)",
//                       color: "white",
//                     }}
//                     onClick={() => handleCardClick(card)}
//                   >
//                     <Box>
//                       <Typography variant="h6" sx={{ color: "#fff" }}>
//                         {card.title}
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: "#e0e0e0" }}>
//                         {card.description}
//                       </Typography>
//                     </Box>
//                   </Paper>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </Paper>
//         ))}

//         {/* Card Details Dialog */}
//         {dialogContent}
//       </Container>
//     </Box>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { supabase } from "../supabase";
import { useUser } from "./contexts/UserContext";
import { MenuItem, Select } from "@mui/material";

export default function SectionsDashboard() {
  const { user } = useUser();
  const [sections, setSections] = useState([]);
  const [sectionCards, setSectionCards] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCopCard, setIsCopCard] = useState(false);
  const backgroundGifUrl = "";

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("sections")
        .select("*")
        .eq("is_active", true);

      if (sectionsError) throw sectionsError;

      const cardPromises = sectionsData.map(async (section) => {
        const { data: cardsData } = await supabase
          .from("section_cards")
          .select("*")
          .eq("section_id", section.id)
          .eq("is_active", true);

        return { [section.id]: cardsData || [] };
      });

      const cardsResults = await Promise.all(cardPromises);
      const cardsMap = cardsResults.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );

      setSections(sectionsData);
      setSectionCards(cardsMap);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsCopCard(card.title === "Download COP/DC Certificates");
    setSelectedOption("");
  };

  const handleVisitCard = () => {
    if (selectedCard?.link) {
      window.open(selectedCard.link, "_blank");
    }
  };

  const getCardDescription = (card) => {
    if (user && card.title === "Download COP/DC Certificates") {
      return "Click to Download";
    }
    return card.description;
  };

  const getDialogDescription = () => {
    if (user && isCopCard) {
      return "Select your certificate from the indos checker select menu";
    }
    return selectedCard?.description;
  };

  const dialogContent = (
    <Dialog
      open={!!selectedCard}
      onClose={() => setSelectedCard(null)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: (theme) => ({
          borderRadius: '16px',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(48, 48, 48, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.6)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }),
      }}
    >
      <DialogTitle
        sx={(theme) => ({
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          py: 2.5,
          px: 3,
          '& .MuiTypography-root': {
            fontSize: '1.5rem',
            fontWeight: 600,
            color: theme.palette.mode === 'dark' ? '#fff' : '#1a1a1a',
          },
        })}
      >
        {selectedCard?.title}
      </DialogTitle>
      <DialogContent sx={(theme) => ({ p: 3 })}>
        <Typography 
          variant="body1" 
          sx={(theme) => ({
            mb: 3,
            color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#424242',
            lineHeight: 1.6,
            fontSize: '1.1rem',
          })}
        >
          {getDialogDescription()}
        </Typography>
  
        {user && isCopCard && (
          <Select
            fullWidth
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            displayEmpty
            sx={(theme) => ({
              mt: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '12px',
              },
              '& .MuiSelect-select': {
                py: 1.5,
                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
              },
            })}
          >
            <MenuItem value="" disabled>
              <Typography sx={(theme) => ({ color: theme.palette.mode === 'dark' ? '#999' : '#666' })}>
                Select Certificate Type
              </Typography>
            </MenuItem>
            {[
              "STCW Course",
              "GMDSS",
              "COP - DC ENDORSEMENTS",
              "COP - DC BASIC",
              "COP - IGF CODE",
              "COP - Rating [ Watch Keeping / AB / ETR ]",
              "COP - Polar Water",
            ].map((option) => (
              <MenuItem 
                key={option} 
                value={option}
                sx={(theme) => ({
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.08)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.12)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.35)' : 'rgba(25, 118, 210, 0.16)',
                    },
                  },
                })}
              >
                {option}
              </MenuItem>
            ))}
          </Select>
        )}
      </DialogContent>
      <DialogActions 
        sx={(theme) => ({
          p: 3, 
          pt: 2,
          gap: 2,
          borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        })}
      >
        <Button 
          onClick={() => setSelectedCard(null)}
          sx={(theme) => ({
            borderRadius: '10px',
            px: 3,
            py: 1,
            color: theme.palette.mode === 'dark' ? '#999' : '#666',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            },
          })}
        >
          Cancel
        </Button>
        {user && isCopCard ? (
          <Button 
            variant="contained" 
            onClick={() => window.open(generateDynamicLink(selectedOption), "_blank")}
            disabled={!selectedOption}
            sx={{
              borderRadius: '10px',
              px: 3,
              py: 1,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(25, 118, 210, 0.3)',
              },
            }}
          >
            Download
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={handleVisitCard}
            sx={{
              borderRadius: '10px',
              px: 3,
              py: 1,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Visit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
  

  const generateDynamicLink = (option) => {
    if (!user || !option) return "";
    
    const monthAbbreviations = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDate = `${day}%2F${month}%2F${year}`;

    const indosNumber = user.professional_info?.indos_number || "";
    let dobDay = "", dobMonth = "", dobYear = "";
    
    if (user.date_of_birth) {
      const [y, m, d] = user.date_of_birth.split("-");
      dobYear = y;
      dobDay = d.startsWith("0") ? d.substring(1) : d;
      const monthIndex = parseInt(m, 10) - 1;
      dobMonth = monthAbbreviations[monthIndex] || "";
    }

    const optionConfig = {
      "STCW Course": { 
        code: "CRSE",
        endpoint: "StcwCourse.jsp"
      },
      "GMDSS": { 
        code: "GMDSS",
        endpoint: "COPDetails.jsp"
      },
      "COP - DC ENDORSEMENTS": { 
        code: "DC",
        endpoint: "COPDetails.jsp"
      },
      "COP - DC BASIC": { 
        code: "COP",
        endpoint: "COPDetails.jsp"
      },
      "COP - IGF CODE": { 
        code: "IGF",
        endpoint: "COPDetails.jsp"
      },
      "COP - Rating [ Watch Keeping / AB / ETR ]": { 
        code: "WK",
        endpoint: "COPDetails.jsp"
      },
      "COP - Polar Water": { 
        code: "DCPOLAR",
        endpoint: "COPDetails.jsp"
      }
    };

    const config = optionConfig[option] || { code: "", endpoint: "COPDetails.jsp" };
    
    return `http://220.156.189.33/esamudraUI/jsp/examination/checker/${config.endpoint}?` +
           `hidSystemDate=${formattedDate}&hidSystemDate1=&hidProcessId=&` +
           `cmbSearch_by=${config.code}&txtNo=${indosNumber}&` +
           `txtDob=${dobDay}%2F${dobMonth}%2F${dobYear}&certNo=`;
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: `url(${backgroundGifUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 1,
        }}
      />
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          mt: 4,
          mb: 4,
          p: 2,
        }}
      >
        {sections.map((section) => (
          <Paper
            key={section.id}
            elevation={3}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(2px)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5" sx={{ color: "#fff" }}>
                {section.title}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 2, color: "#e0e0e0" }}>
              {section.description}
            </Typography>

            <Swiper
              spaceBetween={16}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                768: { slidesPerView: 3.2 },
              }}
            >
              {(sectionCards[section.id] || []).map((card) => (
                <SwiperSlide key={card.id}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      height: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      backdropFilter: "blur(5px)",
                      color: "white",
                    }}
                    onClick={() => handleCardClick(card)}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ color: "#fff" }}>
                        {card.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#e0e0e0" }}>
                        {getCardDescription(card)}
                      </Typography>
                    </Box>
                  </Paper>
                </SwiperSlide>
              ))}
            </Swiper>
          </Paper>
        ))}

        {dialogContent}
      </Container>
    </Box>
  );
}