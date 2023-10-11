import sliderService from "../services/sliderService";

let getSliderList = async (req, res) => {
  try {
    const { page } = req.params;
    let slider = await sliderService.getAllSlider(page);
    res.render("manage/slider/SliderList", {
      data: slider.rows,
      count: slider.count,
      page: page / 1,
    });
  } catch (error) {
    console.log(error);
  }
};

let getCreateSliderPage = async (req, res) => {
  try {
    res.render("manage/slider/CreateSlider");
  } catch (error) {
    console.log(error);
  }
};

let createNewSlider = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Vui lòng chọn ảnh");
    }
    await sliderService.createNewSlider(req.body, req.file);
    res.redirect("/sliderList/1");
  } catch (error) {
    console.log(error);
  }
};

let getEditSliderPage = async (req, res) => {
  try {
    let slider = await sliderService.getEditSlider(req.params.id);
    res.render("manage/slider/EditSlider", { slider });
  } catch (error) {
    console.log(error);
  }
};

let updateSlider = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    await sliderService.updateSlider(req.params.id, req.body, req.file);
    res.redirect("/sliderList/1");
  } catch (error) {
    console.log(error);
  }
};

let deleteSlider = async (req, res) => {
  try {
    await sliderService.deleteSlider(req.body.id);
    res.redirect("/sliderList/1");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getSliderList,
  getCreateSliderPage,
  createNewSlider,
  getEditSliderPage,
  updateSlider,
  deleteSlider,
};
