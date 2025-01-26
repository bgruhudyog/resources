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


export default function SectionsDashboard() {
  const [sections, setSections] = useState([]);
  const [sectionCards, setSectionCards] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  // State for modals
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  // New section/card state
  const [newSection, setNewSection] = useState({ title: "", description: "" });
  const [newCard, setNewCard] = useState({
    section_id: null,
    title: "",
    description: "",
    link: "",
  });

  // Background GIF URL (replace with your actual background GIF)
  const backgroundGifUrl =
    "";

  // Admin authentication and data fetching logic remains the same as previous implementation
  useEffect(() => {
    const checkAdminStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("is_admin")
          .eq("email", user.email)
          .single();

        setIsAdmin(userData?.is_admin === true);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
    fetchSections();
  }, []);

  

  // Existing methods (fetchSections, handleAddSection, handleAddCard, etc.) remain the same
  const fetchSections = async () => {
    try {
      // Fetch sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("sections")
        .select("*")
        .eq("is_active", true);

      if (sectionsError) throw sectionsError;

      // Fetch cards for each section
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

  // Add new section
  const handleAddSection = async () => {
    try {
      const { error } = await supabase.from("sections").insert(newSection);

      if (error) throw error;

      fetchSections();
      setIsAddSectionDialogOpen(false);
      setNewSection({ title: "", description: "" });
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  // Add new card to a section
  const handleAddCard = async () => {
    try {
      const { error } = await supabase.from("section_cards").insert({
        ...newCard,
        section_id: selectedSection.id,
      });

      if (error) throw error;

      fetchSections();
      setIsAddCardDialogOpen(false);
      setNewCard({
        section_id: null,
        title: "",
        description: "",
        link: "",
      });
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  // Card click handler
  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  // Card visit handler
  const handleVisitCard = () => {
    if (selectedCard?.link) {
      window.open(selectedCard.link, "_blank");
    }
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
          backgroundColor: "rgba(0,0,0,0.6)", // Dark overlay to enhance readability
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
        {/* Admin Section Controls */}
        {isAdmin && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsAddSectionDialogOpen(true)}
            >
              Add New Section
            </Button>
          </Box>
        )}

        {/* Sections Rendering */}
        {sections.map((section) => (
          <Paper
            key={section.id}
            elevation={3}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "rgba(0,0,0,0.4)", // Lighter overlay for more gif visibility
              backdropFilter: "blur(2px)", // Add blur effect
              overflow: "hidden",
            }}
          >
            {/* Rest of the section rendering remains the same */}
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
              {isAdmin && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setSelectedSection(section);
                    setIsAddCardDialogOpen(true);
                  }}
                >
                  Add Card
                </Button>
              )}
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
                      backgroundColor: "rgba(0,0,0,0.4)", // Lighter overlay for more gif visibility
                      backdropFilter: "blur(5px)", // Add blur effect
                      color: "white",
                    }}
                    onClick={() => handleCardClick(card)}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ color: "#fff" }}>
                        {card.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#e0e0e0" }}>
                        {card.description}
                      </Typography>
                    </Box>
                  </Paper>
                </SwiperSlide>
              ))}
            </Swiper>
          </Paper>
        ))}

        {/* Existing dialogs remain the same */}
        {/* Add Section Dialog */}
        <Dialog
          open={isAddSectionDialogOpen}
          onClose={() => setIsAddSectionDialogOpen(false)}
        >
          <DialogTitle>Add New Section</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Section Title"
              value={newSection.title}
              onChange={(e) =>
                setNewSection({ ...newSection, title: e.target.value })
              }
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Section Description"
              value={newSection.description}
              onChange={(e) =>
                setNewSection({ ...newSection, description: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddSectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSection} variant="contained">
              Add Section
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Card Dialog */}
        <Dialog
          open={isAddCardDialogOpen}
          onClose={() => setIsAddCardDialogOpen(false)}
        >
          <DialogTitle>Add New Card to {selectedSection?.title}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Card Title"
              value={newCard.title}
              onChange={(e) =>
                setNewCard({ ...newCard, title: e.target.value })
              }
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Card Description"
              value={newCard.description}
              onChange={(e) =>
                setNewCard({ ...newCard, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Card Link"
              value={newCard.link}
              onChange={(e) => setNewCard({ ...newCard, link: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddCardDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCard} variant="contained">
              Add Card
            </Button>
          </DialogActions>
        </Dialog>

        {/* Card Details Dialog */}
        <Dialog
          open={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>{selectedCard?.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">{selectedCard?.description}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedCard(null)}>Back</Button>
            <Button variant="contained" onClick={handleVisitCard}>
              Visit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
