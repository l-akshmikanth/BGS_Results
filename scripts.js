let studentData = [];

// Function to convert number to words
function numberToWords(num) {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';

    function convert(n) {
        if (n < 10) return units[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + units[n % 10] : '');
        if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
    }

    return convert(num);
}

// Fetch student data from JSON file
fetch('results.json')
    .then(response => response.json())
    .then(data => {
        studentData = data.Sheet1;
    })
    .catch(error => {
        console.error('Error loading student data:', error);
    });

function searchResults() {
    const studentID = document.getElementById('studentID').value;
    const student = studentData.find(s => s.slNo == studentID); // Use loose equality to match both strings and numbers

    if (student) {
        document.getElementById('student-name').innerText = `Student Name: ${student.name}`;
        document.getElementById('student-id').innerText = `Student ID: ${student.slNo}`;

        // Calculate and set all subject marks
        let totalTheory = 0;
        let totalPractical = 0;

        // Set and calculate marks for each subject
        totalTheory += setSubjectMarks('kannada', student.kannada_theory, 0);
        totalTheory += setSubjectMarks('english', student.english_theory, 0);

        // Physics
        totalTheory += toNumber(student.physics_theory);
        totalPractical += toNumber(student.physics_practical);
        setSubjectMarks('physics', student.physics_theory, student.physics_practical);

        // Chemistry
        totalTheory += toNumber(student.chemistry_theory);
        totalPractical += toNumber(student.chemistry_practical);
        setSubjectMarks('chemistry', student.chemistry_theory, student.chemistry_practical);

        // Mathematics
        totalTheory += setSubjectMarks('mathematics', student.mathematics_theory, 0);

        // Biology
        totalTheory += toNumber(student.biology_theory);
        totalPractical += toNumber(student.biology_practical);
        setSubjectMarks('biology', student.biology_theory, student.biology_practical);

        // Set total row values
        document.getElementById('theory-total').innerText = totalTheory;
        document.getElementById('practical-total').innerText = totalPractical;
        const grandTotal = totalTheory + totalPractical;
        document.getElementById('grand-total').innerText = grandTotal;

        // Calculate percentage
        const percentage = ((grandTotal / 600) * 100).toFixed(2);
        document.getElementById('percentage').innerText = percentage;

        // Set total marks in words
        document.getElementById('marks-in-words').innerText = numberToWords(grandTotal);

        // Determine class obtained
        let classObtained;
        if (grandTotal >= 510) classObtained = "DISTINCTION";
        else if (grandTotal >= 350) classObtained = "FIRST CLASS";
        else if (grandTotal >= 250) classObtained = "SECOND CLASS";
        else classObtained = "FAIL";

        document.getElementById('class-obtained').innerText = classObtained;
        document.getElementById('final-result').innerText = `${classObtained} (Total: ${grandTotal})`;

        document.getElementById('result-section').style.display = 'block';
    } else {
        alert("No results found for the given Student ID.");
        document.getElementById('result-section').style.display = 'none';
    }
}

// Convert value to number, defaulting to 0 if not a number
function toNumber(value) {
    return parseInt(value) || 0;
}

function setSubjectMarks(subject, theory, practical) {
    const theoryMarks = toNumber(theory);
    const practicalMarks = toNumber(practical);
    const total = theoryMarks + practicalMarks;

    if (document.getElementById(`${subject}-theory`)) {
        document.getElementById(`${subject}-theory`).innerText = theoryMarks;
    }
    if (document.getElementById(`${subject}-practical`)) {
        document.getElementById(`${subject}-practical`).innerText = practicalMarks;
    }
    if (document.getElementById(`${subject}-result`)) {
        document.getElementById(`${subject}-result`).innerText = total;
    }

    return theoryMarks;
}

function printMarksheet() {
    window.print();
}
