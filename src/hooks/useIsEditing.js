import {useRef, useState} from 'react'

/**
 * Een custom hook die bijhoud of een gebruiker een bepaalde state waarde aan het aanpassen is of niet.
 *
 * @param defaultValue {string | undefined} De tekst die weergegeven moet worden in het formulier als de applicatie
 * start, standaard een lege string.
 * @param debounceTime {number | undefined} De hoeveelheid
 * aan hoelang het duurt voordat de isEditing boolean op false gezet wordt, standaard 500 ms.
 * @return {[value: string, setValue: (evt: Event) => void, isEditing: boolean]} De setValue functie is een
 * eventListener die rechtstreeks aan het onChange event van een formulier element gekoppeld kan worden. De boolean
 * isEditing geeft weer of de gebruiker het formulierelement nog aan het wijzigen is.
 */
const useIsEditing = ({defaultValue = '', debounceTime = 500} = {}) => {
    const [value, setValue] = useState(defaultValue)
    const [isEditing, setIsEditing] = useState(false)

    // Een gewone variabele leeft enkel binnen de scope van een functie, via de useRef hook kunnen we een persistente
    // variabele aan maken, een variabele die doorheen verschillende oproepen van de functie beschikbaar is.
    // Gebruik useRef in de plaats van useState als de variabele geen invloed heeft op het UI.
    // De useRef hook geeft een object terug met een current property, gebruik hier geen deconstructing, dit werkt niet
    // omwille van de manier waarop useRef geïmplementeerd is.
    const timeoutId = useRef(null)

    const timeoutFinishedHandler = () => {
        setIsEditing(false)
        timeoutId.current = null
    }

    /**
     * @param evt {Event} Het form change event dat afgevuurd werd bij een wijziging in het formulier.
     */
    const updateValue = (evt) => {
        // Als er al een timeout ingesteld was, moet deze geannuleerd worden.
        if (timeoutId.current) {
            clearTimeout(timeoutId.current)
        }
        setValue(evt.target.value)

        // Stel isEditing op true in, en zet het nadat debounceTime ms verstreken zijn terug op false.
        setIsEditing(true)
        timeoutId.current = setTimeout(timeoutFinishedHandler, debounceTime)
    }

    return [
        value,
        updateValue,
        isEditing
    ]
}

export default useIsEditing;
