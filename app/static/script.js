let switch_view = 0;
let switch_pn_point = 1;

document.addEventListener('keydown', function(event) {
    if (event.key === '1') {
        buttonClick('image');
        switch_view = 0;
    } 
    else if (event.key === '2') {
        buttonClick('maskImage');
        switch_view = 1;
    }
    else if (event.key === '3') {
        buttonClick('colorMasks');
        switch_view = 2;
    }
    else if (event.key === 'v') {
        if (switch_view === 0) {
            buttonClick('maskImage');
        }
        else if (switch_view === 1) {
            buttonClick('colorMasks');
        }
        else if (switch_view === 2) {
            buttonClick('image')
        }
        switch_view = (switch_view + 1) % 3;
    }
    else if (event.key === "c" && !event.ctrlKey) {
        buttonClick('clear');
    }
    else if (event.key === '4') {
        buttonClick('button4');
    }
    else if (event.key === '5') {
        buttonClick('button5');
    }
    else if (event.key === '6' || event.key === "b") {
        buttonClick('button6');
    }
    else if (event.key === '7' || event.key === "r") {
        buttonClick('inference');
    }
    else if (event.key === '8') {
        buttonClick('undo');
    }
    else if (event.key === 'ArrowLeft') {
        buttonClick('prev-image');
    }
    else if (event.key === 'ArrowRight') {
        buttonClick('next-image');
    }
    else if (event.key === 'p') {
        if (switch_pn_point === 0) {
            buttonClick('button4');
        }
        else if (switch_pn_point === 1) {
            buttonClick('button5');
        }
        switch_pn_point ^= 1;
    }
});

function buttonClick(buttonId) {
    const button = document.getElementById(buttonId);
    button.click();
}

document.getElementById('image').addEventListener('click', function() {
    console.log('Button image clicked');
});

document.getElementById('maskImage').addEventListener('click', function() {
    console.log('Button maskImage clicked');
});

document.getElementById('colorMasks').addEventListener('click', function() {
    console.log('Button colorMasks clicked');
});

document.getElementById('clear').addEventListener('click', function() {
    console.log('Button clear clicked');
});

document.getElementById('button4').addEventListener('click', function() {
    console.log('Button 4 clicked');
});

document.getElementById('button5').addEventListener('click', function() {
    console.log('Button 5 clicked');
});

document.getElementById('button6').addEventListener('click', function() {
    console.log('Button 6 clicked');
});

document.getElementById('inference').addEventListener('click', function() {
    console.log('Button inference clicked');
});

document.getElementById('undo').addEventListener('click', function() {
    console.log('Button 8 clicked');
});

document.getElementById('prev-image').addEventListener('click', function() {
    console.log('Button prev-image clicked');
});

document.getElementById('next-image').addEventListener('click', function() {
    console.log('Button next-image clicked');
});

// ctrl Shortcuts
$(document).keydown(function (event) {
    // Check if the Ctrl key is pressed and the key code for the 's' key (83)
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault(); // Prevent the browser's default save action
        buttonClick('save-masks'); // Call the function to save the image
    }
});
$(document).keydown(function (event) {
    if (event.ctrlKey && event.key === 'l') {
        event.preventDefault(); // Prevent the browser's default save action
        buttonClick('load-image'); // Call the function to save the image
    }
});
$(document).keydown(function (event) {
    if (event.ctrlKey && event.key === 'z') {
        event.preventDefault(); // Prevent the browser's default save action
        buttonClick('undo'); // Call the function to save the image
    }
});
$(document).keydown(function (event) {
    if (event.key === 'z' && !event.ctrlKey) {
        event.preventDefault(); // Prevent the browser's default save action
        buttonClick('toggle-zoom'); // Call the function to save the image
    }
});

// Mouse wheel event

// For #Thumbnail-container
function handleMouseWheelScroll(e) {
    const thumbnailContainer = document.getElementById("thumbnail-container");
    e.preventDefault();
    // Scroll horizontally based on the wheelDeltaY value
    thumbnailContainer.scrollLeft += e.deltaY * 2;
}
document.getElementById("thumbnail-container").addEventListener("wheel", handleMouseWheelScroll);

// For preview zoom in / zoom out
function handleMouseWheel(e) {
    e.preventDefault();
    const scaleFactor = 0.1;
    const preview = document.getElementById("preview");
    const container = document.getElementById("image-container");

    // Calculate the new width and height
    let newWidth = preview.clientWidth + (e.deltaY < 0 ? 2 : -1) * scaleFactor * preview.clientWidth;
    let newHeight = preview.clientHeight + (e.deltaY < 0 ? 2 : -1) * scaleFactor * preview.clientHeight;

    if (newWidth < 100 || newHeight < 100) {
        newWidth = container.clientWidth;
        newHeight = container.clientHeight;
        return;
    }

    // Maintain the aspect ratio
    const aspectRatio = preview.naturalWidth / preview.naturalHeight;
    newHeight = newWidth / aspectRatio;

    // Get the computed style of the preview element and parent elements
    const previewStyle = getComputedStyle(preview);
    const maxHeight = parseFloat(previewStyle['max-height']);
    const maxWidth = parseFloat(previewStyle['max-width']);

    // if exceed the max size, set to max size
    if (newHeight > maxHeight || newWidth > maxWidth) {
        // Calculate the new width and height while maintaining the aspect ratio
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
        if (newWidth > maxWidth) {
            newWidth = maxWidth;
            newHeight = newWidth / aspectRatio;
        }
        console.log("Image set to max size")
    }

    // Update the preview size
    preview.style.width = `${newWidth}px`;
    preview.style.height = `${newHeight}px`;

    // Adjust the container scroll position to zoom in/out from the image center
    const centerX = (container.scrollWidth - container.clientWidth) / 2;
    const centerY = (container.scrollHeight - container.clientHeight) / 2;
    container.scrollLeft = centerX;
    container.scrollTop = centerY;
    updatePointsAndBoxes();
}

document.getElementById("preview").addEventListener("wheel", handleMouseWheel);

function getScalingFactor(originalWidth, originalHeight, currentWidth, currentHeight) {
    return {
        x: currentWidth / originalWidth,
        y: currentHeight / originalHeight
    };
}

function updatePointsAndBoxes() {
    const originalWidth = $('#preview').data('originalWidth');
    const originalHeight = $('#preview').data('originalHeight');
    const currentWidth = $('#preview').width();
    const currentHeight = $('#preview').height();

    const scalingFactor = getScalingFactor(originalWidth, originalHeight, currentWidth, currentHeight);

    points.forEach(point => {
        point.style.left = parseFloat(point.dataset.originalX) * scalingFactor.x - 4 + 'px';
        point.style.top = parseFloat(point.dataset.originalY) * scalingFactor.y - 4 + 'px';
    });

    boxes.forEach(box => {
        box.style.left = parseFloat(box.dataset.originalX1) * scalingFactor.x + 'px';
        box.style.top = parseFloat(box.dataset.originalY1) * scalingFactor.y + 'px';
        box.style.width = (parseFloat(box.dataset.originalX2) - parseFloat(box.dataset.originalX1)) * scalingFactor.x + 'px';
        box.style.height = (parseFloat(box.dataset.originalY2) - parseFloat(box.dataset.originalY1)) * scalingFactor.y + 'px';
    });
}

function togglePointsAndBoxesVisibility(button_id) {
    const imageContainer = document.getElementById("image-container");
    const pointsAndBoxes = imageContainer.querySelectorAll(".point, .box");

    pointsAndBoxes.forEach(element => {
        if (button_id === 1) {
            element.style.display = "block";
        } 
        else if (button_id === 2) {
            element.style.display = "none";
        }
    });
}

function toggleProcessingButtons(disabled) {
    $("button").prop("disabled", disabled);
    if (disabled) {
        $("button").addClass("processing");
    } else {
        $("button").removeClass("processing");
    }
}

function toggleSelectedViewButton(buttonId) {
    // Remove the 'selected-view' class from all view buttons
    $("#image, #maskImage, #colorMasks").removeClass("selected-view");
    // Add the 'selected-view' class to the clicked view button
    $(`#${buttonId}`).addClass("selected-view");
}

function toggleSelectedModeButton(buttonId) {
    // Remove the 'selected-Mode' class from all Mode buttons
    $("#button4, #button5, #button6").removeClass("selected-view");
    // Add the 'selected-Mode' class to the clicked Mode button
    $(`#${buttonId}`).addClass("selected-view");
}

function toggleZoomButton(zoomEnabled) {
    if (zoomEnabled) {
        $("#toggle-zoom").addClass("selected-view");
    }
    else {
        $("#toggle-zoom").removeClass("selected-view");
    }
}
