function letna_dohodnina_razred(leto, neto_letna_davcna_osnova)
{
    var faktor = faktor_osnove(leto)
    if (neto_letna_davcna_osnova <= 8500  * faktor) return 16
    if (neto_letna_davcna_osnova <= 25000 * faktor) return 26
    if (neto_letna_davcna_osnova <= 50000 * faktor) return 33
    if (neto_letna_davcna_osnova <= 72000 * faktor) return 39
    return leto < 2022 ? 50 : 45
}

function letna_dohodnina(leto, neto_letna_davcna_osnova)
{
    // Izračuna letno neto dohodnino glede na lestvico
    var faktor = faktor_osnove(leto)
    if (neto_letna_davcna_osnova <= 8500 * faktor)
        return round(neto_letna_davcna_osnova * .16)
    if (neto_letna_davcna_osnova <= 25000 * faktor)
        return round(1360 * faktor + (neto_letna_davcna_osnova - 8500 * faktor) * .26)
    if (neto_letna_davcna_osnova <= 50000 * faktor)
        return round(5650 * faktor + (neto_letna_davcna_osnova - 25000 * faktor) * .33)
    if (neto_letna_davcna_osnova <= 72000 * faktor)
        return round(13900 * faktor + (neto_letna_davcna_osnova - 50000 * faktor) * .39)
    return round(22480 * faktor + (neto_letna_davcna_osnova - 72000 * faktor) * (leto < 2022 ? .50 : .45))
}

function faktor_osnove(leto)
{
    return 1 + Math.min(Math.max(leto - 2021, 0), 4) * 0.03
}

function splosna_olajsava(leto, skupni_dohodek)
{
    // Višina skupne splošne olajšave je odvisna od višine skupnega dohodka v letu
    var olajsava
    if (leto <= 2021) {
        olajsava = 3500
    } else if (leto == 2022) {
        olajsava = 4500
    } else if (leto == 2023) {
        olajsava = 5500
    } else if (leto == 2024) {
        olajsava = 6500
    } else {
        olajsava = 7500
    }
    if (skupni_dohodek <= 13316.83)
        return olajsava + (18700.38 - 1.40427 * skupni_dohodek)
    return olajsava
}

function olajsava_vzdrzevani_otroci(leto, stevilo_vzdrzevanih_otrok)
{
    // Izračun olajšave glede na število vzdrževanih otrok (<18 let)
    var olajsava = 0
    if (stevilo_vzdrzevanih_otrok >= 1) {
        olajsava += 2436.92
        if (stevilo_vzdrzevanih_otrok >= 2) {
            olajsava += 2649.24
            if (stevilo_vzdrzevanih_otrok >= 3) {
                olajsava += 4418.54
                if (stevilo_vzdrzevanih_otrok >= 4) {
                    olajsava += 6187.85
                    if (stevilo_vzdrzevanih_otrok >= 5) {
                        olajsava += 7957.14
                        //  Za vse nadaljnje vzdrževane otroke se višina olajšave poveča za 1.769,30 eura
                        //  (mesečno za 147,44 eura) glede na višino olajšave za predhodnega vzdrževanega otroka.
                        var predhodni_otrok = 9726.44 // 7957,14 + 1769,30
                        for (var i = 6; i <= stevilo_vzdrzevanih_otrok; i++) {
                            olajsava += predhodni_otrok
                            predhodni_otrok = predhodni_otrok + 1769.30
                        }
                    }
                }
            }
        }
    }
    return leto < 2022 ? olajsava : olajsava * faktor_osnove(leto)
}

function olajsava_vzdrzevani_druzinski_clani(stevilo_vzdrzevanih_druzinskih_clanov)
{
    // Izračun olajšave glede na število vzdrževanih družinskih članov
    return stevilo_vzdrzevanih_druzinskih_clanov * 2436.92
}

function ostale_olajsave(
    leto,
    bruto_zasluzek,
    stevilo_vzdrzevanih_druzinskih_clanov = 0,
    stevilo_vzdrzevanih_mesecev = 12,
    premija_dod_pok_zav = 0,
    invalid = false)
{
    // 1. Splošna olajšava
    var znesek_splosna_olajsava = splosna_olajsava(leto, bruto_zasluzek)

    // 2. Osebne olajšave za 100% invalide
    var znesek_olajsava_za_invalide = invalid ? 17658.84 : 0

    // 4. za vzdrževane družinske člane
    var olajsava_za_vzdrzevane_druzinske_clane = olajsava_vzdrzevani_druzinski_clani(
        stevilo_vzdrzevanih_druzinskih_clanov) * (stevilo_vzdrzevanih_mesecev/12)

    // 5. Olajšava za prostovoljno dodatno pokojninsko zavarovanje
    // Največ do zneska premije, ki je enak 24 % obveznih prispevkov za
    // pokojninsko in invalidsko zavarovanje za zavarovanca
    // Oziroma 5,844% pokojnine zavarovanca
    var znesek_olajsava_za_dodatno_pokojnino = Math.min(premija_dod_pok_zav, bruto_zasluzek * 0.221 * 0.24)
    // Ne več kot 2.819,09 eurov letno.
    znesek_olajsava_za_dodatno_pokojnino = Math.min(znesek_olajsava_za_dodatno_pokojnino, 2819.09)

    return znesek_splosna_olajsava + 
           znesek_olajsava_za_invalide + 
           olajsava_za_vzdrzevane_druzinske_clane +
           znesek_olajsava_za_dodatno_pokojnino
}

function letna_davcna_osnova(
                        leto,
                        bruto_zasluzek,
                        stevilo_vzdrzevanih_otrok = 0,
                        stevilo_vzdrzevanih_druzinskih_clanov = 0,
                        stevilo_vzdrzevanih_mesecev = 12,
                        premija_dod_pok_zav = 0,
                        invalid = false)
{
    // =======================
    // Davčne olajšave (letno)
    // =======================
    var znesek_ostale_olajsave = ostale_olajsave(
        leto,
        bruto_zasluzek,
        stevilo_vzdrzevanih_druzinskih_clanov,
        stevilo_vzdrzevanih_mesecev,
        premija_dod_pok_zav,
        invalid
    )

    var olajsava_za_vzdrzevane_otroke = olajsava_vzdrzevani_otroci(leto, stevilo_vzdrzevanih_otrok) * stevilo_vzdrzevanih_mesecev / 12

    // Prispevki (za pokojninsko in invalidsko zavarovanje)
    // Zaposleni:  22.1%
    var prispevki = bruto_zasluzek * 0.221
    var olajsave = znesek_ostale_olajsave + olajsava_za_vzdrzevane_otroke

    var neto_davcna_osnova = Math.max(bruto_zasluzek - prispevki - olajsave, 0)

    // Stopnja dohodnine (letno)
    return neto_davcna_osnova
}

function izracunaj_dohodnino(
    leto,
    bruto_zasluzek,
    stevilo_vzdrzevanih_otrok = 0,
    stevilo_vzdrzevanih_druzinskih_clanov = 0,
    stevilo_vzdrzevanih_mesecev = 12,
    premija_dod_pok_zav = 0,
    invalid = false
) {
    var neto_davcna_osnova = letna_davcna_osnova(
        leto,
        bruto_zasluzek,
        stevilo_vzdrzevanih_otrok,
        stevilo_vzdrzevanih_druzinskih_clanov,
        stevilo_vzdrzevanih_mesecev,
        premija_dod_pok_zav,
        invalid
    )
    return letna_dohodnina(leto, neto_davcna_osnova)
}

function round(n)
{
    return Math.round(n * 100) / 100
}

exports.letna_dohodnina_razred = letna_dohodnina_razred
exports.letna_dohodnina = letna_dohodnina
exports.splosna_olajsava = splosna_olajsava
exports.olajsava_vzdrzevani_otroci = olajsava_vzdrzevani_otroci
exports.olajsava_vzdrzevani_druzinski_clani = olajsava_vzdrzevani_druzinski_clani
exports.ostale_olajsave = ostale_olajsave
exports.letna_davcna_osnova = letna_davcna_osnova
exports.izracunaj_dohodnino = izracunaj_dohodnino
exports.round = round
