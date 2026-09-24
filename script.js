/* =========================
   DATA ABSENSI
========================= */

let dataAbsensi =
    JSON.parse(localStorage.getItem("dataAbsensi")) || [];


/* =========================
   BUAT QR CODE
========================= */

function buatQR() {

    const nimInput =
        document.getElementById("nimInput");

    const nim =
        nimInput.value.trim();

    const qrContainer =
        document.getElementById("qrcode");

    const qrNim =
        document.getElementById("qrNim");

    const pesan =
        document.getElementById("pesanQR");


    /* Validasi */

    if (nim === "") {

        pesan.innerText =
            "Silakan masukkan NIM terlebih dahulu.";

        pesan.style.color = "#e83d87";

        return;
    }


    /* Hapus QR sebelumnya */

    qrContainer.innerHTML = "";


    /* Buat QR */

    new QRCode(qrContainer, {

        text: nim,

        width: 200,

        height: 200,

        colorDark: "#1d1d1d",

        colorLight: "#ffffff",

        correctLevel:
            QRCode.CorrectLevel.H

    });


    qrNim.innerText =
        "NIM: " + nim;

    pesan.innerText =
        "QR Code berhasil dibuat.";

    pesan.style.color = "#e83d87";
}


/* =========================
   DOWNLOAD QR
========================= */

function downloadQR() {

    const qr =
        document.querySelector("#qrcode img");

    if (!qr) {

        alert("Buat QR Code terlebih dahulu.");

        return;
    }


    const link =
        document.createElement("a");

    link.href = qr.src;

    link.download =
        "QR-Absensi.png";

    link.click();
}


/* =========================
   SCANNER
========================= */

let scanner = null;


function mulaiScanner() {

    const result =
        document.getElementById("scanResult");


    if (scanner !== null) {

        result.innerText =
            "Scanner sudah berjalan.";

        return;
    }


    scanner =
        new Html5Qrcode("reader");


    scanner.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,

            qrbox: {
                width: 250,
                height: 250
            }
        },


        function(decodedText) {

            /* QR berisi NIM */

            const nim =
                decodedText.trim();


            if (nim === "") {

                return;
            }


            catatAbsensi(nim);


            result.innerText =
                "Absensi berhasil untuk NIM: " + nim;


            result.style.color =
                "#e83d87";


            /* Stop kamera */

            scanner.stop().then(() => {

                scanner = null;

            });

        },


        function(errorMessage) {

            /* Error scan diabaikan */

        }

    ).catch(function(error) {

        result.innerText =
            "Kamera tidak dapat digunakan. Pastikan izin kamera diberikan.";

        result.style.color =
            "#e83d87";

        scanner = null;
    });
}


/* =========================
   CATAT ABSENSI
========================= */

function catatAbsensi(nim) {

    const sekarang =
        new Date();


    const tanggal =
        sekarang.toLocaleDateString(
            "id-ID"
        );


    const jam =
        sekarang.toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    /* Cek apakah sudah absen */

    const sudahAbsen =
        dataAbsensi.some(function(data) {

            return (
                data.nim === nim &&
                data.tanggal === tanggal
            );

        });


    if (sudahAbsen) {

        alert(
            "NIM " +
            nim +
            " sudah melakukan absensi hari ini."
        );

        return;
    }


    /* Tambahkan data */

    dataAbsensi.push({

        nim: nim,

        tanggal: tanggal,

        jam: jam,

        status: "Hadir"

    });


    /* Simpan */

    localStorage.setItem(
        "dataAbsensi",
        JSON.stringify(dataAbsensi)
    );


    tampilkanData();
}


/* =========================
   TAMPILKAN DATA
========================= */

function tampilkanData() {

    const tabel =
        document.getElementById(
            "tabelAbsensi"
        );

    const kosong =
        document.getElementById(
            "kosong"
        );


    tabel.innerHTML = "";


    if (dataAbsensi.length === 0) {

        kosong.style.display =
            "block";

        return;
    }


    kosong.style.display =
        "none";


    dataAbsensi.forEach(
        function(data, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${index + 1}</td>

                <td>
                    <strong>${data.nim}</strong>
                </td>

                <td>
                    ${data.tanggal}
                </td>

                <td>
                    ${data.jam}
                </td>

                <td>
                    <span class="status">
                        ${data.status}
                    </span>
                </td>

            `;


            tabel.appendChild(row);

        }
    );
}


/* =========================
   HAPUS SEMUA DATA
========================= */

function hapusSemua() {

    if (dataAbsensi.length === 0) {

        alert(
            "Belum ada data absensi."
        );

        return;
    }


    const konfirmasi =
        confirm(
            "Apakah kamu yakin ingin menghapus semua data absensi?"
        );


    if (konfirmasi) {

        dataAbsensi = [];


        localStorage.removeItem(
            "dataAbsensi"
        );


        tampilkanData();
    }
}


/* =========================
   LOAD DATA SAAT WEBSITE DIBUKA
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        tampilkanData();

    }
);