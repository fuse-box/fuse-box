/**
 * // MODIFICATION
 * https://github.com/galerija/toascii-js
 *
 * This is a modification of fold-to-ascii.js (https://github.com/mplatt/fold-to-ascii-js).
 * Original (fold-to-ascii) functions were combined into a new string method.
 * Beside that characters database was limited to lowercase characters only
 * and lower/uppercase transformation is used instead.
 * All credit goes to the original author.
 *
 * // USAGE
 * Use as any other function: toAscii(string);
 *
 * // ORIGINAL LICENSE AND INFO
 * fold-to-ascii.js
 * https://github.com/mplatt/fold-to-ascii-js
 *
 * This is a JavaScript port of the Apache Lucene ASCII Folding Filter.
 *
 * The Apache Lucene ASCII Folding Filter is licensed to the Apache Software
 * Foundation (ASF) under one or more contributor license agreements. See the
 * NOTICE file distributed with this work for additional information regarding
 * copyright ownership. The ASF licenses this file to You under the Apache
 * License, Version 2.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * This port uses an example from the Mozilla Developer Network published prior
 * to August 20, 2010
 *
 * fixedCharCodeAt is licencesed under the MIT License (MIT)
 *
 * Copyright (c) 2013 Mozilla Developer Network and individual contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export function toAscii(string) {
  if (string === null) {
    return '';
  }

  var outStr = '';

  for (var i = 0; i < string.length; i++) {
    var letter = string.charAt(i);
    var upper = false;
    if (letter === letter.toUpperCase() && letter !== letter.toLowerCase()) upper = true;

    i = i || 0;
    var code = string.toLowerCase().charCodeAt(i);
    var hi, low;

    if (0xd800 <= code && code <= 0xdbff) {
      hi = code;
      low = string.toLowerCase().charCodeAt(i + 1);
      if (isNaN(low)) {
        throw 'High surrogate not followed by low surrogate in fixedCharCodeAt()';
      }
      return (hi - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000;
    }
    if (0xdc00 <= code && code <= 0xdfff) {
      /*
       * Low surrogate: We return false to allow loops to skip this
       * iteration since should have already handled high surrogate above
       * in the previous iteration
       */
      return false;
    }
    var charCode = code;

    if (charCode) {
      if (charCode < 128) {
        // character is latin -> keep it
        outStr += upper ? String.fromCharCode(charCode).toUpperCase() : String.fromCharCode(charCode);
      } else {
        var replacement;
        // change character
        switch (charCode) {
          case 0x101: // ā	[LATIN SMALL LETTER A WITH MACRON]
          case 0x103: // ă	[LATIN SMALL LETTER A WITH BREVE]
          case 0x105: // ą	[LATIN SMALL LETTER A WITH OGONEK]
          case 0x1ce: // ǎ	[LATIN SMALL LETTER A WITH CARON]
          case 0x1d8f: // ᶏ	[LATIN SMALL LETTER A WITH RETROFLEX HOOK]
          case 0x1d95: // ᶕ	[LATIN SMALL LETTER SCHWA WITH RETROFLEX HOOK]
          case 0x1df: // ǟ	[LATIN SMALL LETTER A WITH DIAERESIS AND MACRON]
          case 0x1e01: // ạ	[LATIN SMALL LETTER A WITH RING BELOW]
          case 0x1e1: // ǡ	[LATIN SMALL LETTER A WITH DOT ABOVE AND MACRON]
          case 0x1e9a: // ả	[LATIN SMALL LETTER A WITH RIGHT HALF RING]
          case 0x1ea1: // ạ	[LATIN SMALL LETTER A WITH DOT BELOW]
          case 0x1ea3: // ả	[LATIN SMALL LETTER A WITH HOOK ABOVE]
          case 0x1ea5: // ấ	[LATIN SMALL LETTER A WITH CIRCUMFLEX AND ACUTE]
          case 0x1ea7: // ầ	[LATIN SMALL LETTER A WITH CIRCUMFLEX AND GRAVE]
          case 0x1ea9: // ẩ	[LATIN SMALL LETTER A WITH CIRCUMFLEX AND HOOK ABOVE]
          case 0x1eab: // ẫ	[LATIN SMALL LETTER A WITH CIRCUMFLEX AND TILDE]
          case 0x1ead: // ậ	[LATIN SMALL LETTER A WITH CIRCUMFLEX AND DOT BELOW]
          case 0x1eaf: // ắ	[LATIN SMALL LETTER A WITH BREVE AND ACUTE]
          case 0x1eb1: // ằ	[LATIN SMALL LETTER A WITH BREVE AND GRAVE]
          case 0x1eb3: // ẳ	[LATIN SMALL LETTER A WITH BREVE AND HOOK ABOVE]
          case 0x1eb5: // ẵ	[LATIN SMALL LETTER A WITH BREVE AND TILDE]
          case 0x1eb7: // ặ	[LATIN SMALL LETTER A WITH BREVE AND DOT BELOW]
          case 0x1fb: // ǻ	[LATIN SMALL LETTER A WITH RING ABOVE AND ACUTE]
          case 0x201: // ȁ	[LATIN SMALL LETTER A WITH DOUBLE GRAVE]
          case 0x203: // ȃ	[LATIN SMALL LETTER A WITH INVERTED BREVE]
          case 0x2090: // ₐ	[LATIN SUBSCRIPT SMALL LETTER A]
          case 0x2094: // ₔ	[LATIN SUBSCRIPT SMALL LETTER SCHWA]
          case 0x227: // ȧ	[LATIN SMALL LETTER A WITH DOT ABOVE]
          case 0x24d0: // ⓐ	[CIRCLED LATIN SMALL LETTER A]
          case 0x250: // ɐ	[LATIN SMALL LETTER TURNED A]
          case 0x259: // ə	[LATIN SMALL LETTER SCHWA]
          case 0x25a: // ɚ	[LATIN SMALL LETTER SCHWA WITH HOOK]
          case 0x2c65: // ⱥ	[LATIN SMALL LETTER A WITH STROKE]
          case 0x2c6f: // Ɐ	[LATIN CAPITAL LETTER TURNED A]
          case 0xe0: // à	[LATIN SMALL LETTER A WITH GRAVE]
          case 0xe1: // á	[LATIN SMALL LETTER A WITH ACUTE]
          case 0xe2: // â	[LATIN SMALL LETTER A WITH CIRCUMFLEX]
          case 0xe3: // ã	[LATIN SMALL LETTER A WITH TILDE]
          case 0xe4: // ä	[LATIN SMALL LETTER A WITH DIAERESIS]
          case 0xe5: // å	[LATIN SMALL LETTER A WITH RING ABOVE]
          case 0xff41: // ａ	[FULLWIDTH LATIN SMALL LETTER A]
            replacement = 'a';
            break;
          case 0x107: // ć	[LATIN SMALL LETTER C WITH ACUTE]
          case 0x109: // ĉ	[LATIN SMALL LETTER C WITH CIRCUMFLEX]
          case 0x10b: // ċ	[LATIN SMALL LETTER C WITH DOT ABOVE]
          case 0x10d: // č	[LATIN SMALL LETTER C WITH CARON]
          case 0x188: // ƈ	[LATIN SMALL LETTER C WITH HOOK]
          case 0x1e09: // ḉ	[LATIN SMALL LETTER C WITH CEDILLA AND ACUTE]
          case 0x2184: // ↄ	[LATIN SMALL LETTER REVERSED C]
          case 0x23c: // ȼ	[LATIN SMALL LETTER C WITH STROKE]
          case 0x24d2: // ⓒ	[CIRCLED LATIN SMALL LETTER C]
          case 0x255: // ɕ	[LATIN SMALL LETTER C WITH CURL]
          case 0xa73e: // Ꜿ	[LATIN CAPITAL LETTER REVERSED C WITH DOT]
          case 0xa73f: // ꜿ	[LATIN SMALL LETTER REVERSED C WITH DOT]
          case 0xe7: // ç	[LATIN SMALL LETTER C WITH CEDILLA]
          case 0xff43: // ｃ	[FULLWIDTH LATIN SMALL LETTER C]
            replacement = 'c';
            break;
          case 0x10f: // ď	[LATIN SMALL LETTER D WITH CARON]
          case 0x111: // đ	[LATIN SMALL LETTER D WITH STROKE]
          case 0x18c: // ƌ	[LATIN SMALL LETTER D WITH TOPBAR]
          case 0x1d6d: // ᵭ	[LATIN SMALL LETTER D WITH MIDDLE TILDE]
          case 0x1d81: // ᶁ	[LATIN SMALL LETTER D WITH PALATAL HOOK]
          case 0x1d91: // ᶑ	[LATIN SMALL LETTER D WITH HOOK AND TAIL]
          case 0x1e0b: // ḋ	[LATIN SMALL LETTER D WITH DOT ABOVE]
          case 0x1e0d: // ḍ	[LATIN SMALL LETTER D WITH DOT BELOW]
          case 0x1e0f: // ḏ	[LATIN SMALL LETTER D WITH LINE BELOW]
          case 0x1e11: // ḑ	[LATIN SMALL LETTER D WITH CEDILLA]
          case 0x1e13: // ḓ	[LATIN SMALL LETTER D WITH CIRCUMFLEX BELOW]
          case 0x221: // ȡ	[LATIN SMALL LETTER D WITH CURL]
          case 0x24d3: // ⓓ	[CIRCLED LATIN SMALL LETTER D]
          case 0x256: // ɖ	[LATIN SMALL LETTER D WITH TAIL]
          case 0x257: // ɗ	[LATIN SMALL LETTER D WITH HOOK]
          case 0xa77a: // ꝺ	[LATIN SMALL LETTER INSULAR D]
          case 0xf0: // ð	[LATIN SMALL LETTER ETH]
          case 0xff44: // ｄ	[FULLWIDTH LATIN SMALL LETTER D]
            replacement = 'd';
            break;
          case 0x113: // ē	[LATIN SMALL LETTER E WITH MACRON]
          case 0x115: // ĕ	[LATIN SMALL LETTER E WITH BREVE]
          case 0x117: // ė	[LATIN SMALL LETTER E WITH DOT ABOVE]
          case 0x119: // ę	[LATIN SMALL LETTER E WITH OGONEK]
          case 0x11b: // ě	[LATIN SMALL LETTER E WITH CARON]
          case 0x1d08: // ᴈ	[LATIN SMALL LETTER TURNED OPEN E]
          case 0x1d92: // ᶒ	[LATIN SMALL LETTER E WITH RETROFLEX HOOK]
          case 0x1d93: // ᶓ	[LATIN SMALL LETTER OPEN E WITH RETROFLEX HOOK]
          case 0x1d94: // ᶔ	[LATIN SMALL LETTER REVERSED OPEN E WITH RETROFLEX HOOK]
          case 0x1dd: // ǝ	[LATIN SMALL LETTER TURNED E]
          case 0x1e15: // ḕ	[LATIN SMALL LETTER E WITH MACRON AND GRAVE]
          case 0x1e17: // ḗ	[LATIN SMALL LETTER E WITH MACRON AND ACUTE]
          case 0x1e19: // ḙ	[LATIN SMALL LETTER E WITH CIRCUMFLEX BELOW]
          case 0x1e1b: // ḛ	[LATIN SMALL LETTER E WITH TILDE BELOW]
          case 0x1e1d: // ḝ	[LATIN SMALL LETTER E WITH CEDILLA AND BREVE]
          case 0x1eb9: // ẹ	[LATIN SMALL LETTER E WITH DOT BELOW]
          case 0x1ebb: // ẻ	[LATIN SMALL LETTER E WITH HOOK ABOVE]
          case 0x1ebd: // ẽ	[LATIN SMALL LETTER E WITH TILDE]
          case 0x1ebf: // ế	[LATIN SMALL LETTER E WITH CIRCUMFLEX AND ACUTE]
          case 0x1ec1: // ề	[LATIN SMALL LETTER E WITH CIRCUMFLEX AND GRAVE]
          case 0x1ec3: // ể	[LATIN SMALL LETTER E WITH CIRCUMFLEX AND HOOK ABOVE]
          case 0x1ec5: // ễ	[LATIN SMALL LETTER E WITH CIRCUMFLEX AND TILDE]
          case 0x1ec7: // ệ	[LATIN SMALL LETTER E WITH CIRCUMFLEX AND DOT BELOW]
          case 0x205: // ȅ	[LATIN SMALL LETTER E WITH DOUBLE GRAVE]
          case 0x207: // ȇ	[LATIN SMALL LETTER E WITH INVERTED BREVE]
          case 0x2091: // ₑ	[LATIN SUBSCRIPT SMALL LETTER E]
          case 0x229: // ȩ	[LATIN SMALL LETTER E WITH CEDILLA]
          case 0x247: // ɇ	[LATIN SMALL LETTER E WITH STROKE]
          case 0x24d4: // ⓔ	[CIRCLED LATIN SMALL LETTER E]
          case 0x258: // ɘ	[LATIN SMALL LETTER REVERSED E]
          case 0x25b: // ɛ	[LATIN SMALL LETTER OPEN E]
          case 0x25c: // ɜ	[LATIN SMALL LETTER REVERSED OPEN E]
          case 0x25d: // ɝ	[LATIN SMALL LETTER REVERSED OPEN E WITH HOOK]
          case 0x25e: // ɞ	[LATIN SMALL LETTER CLOSED REVERSED OPEN E]
          case 0x29a: // ʚ	[LATIN SMALL LETTER CLOSED OPEN E]
          case 0x2c78: // ⱸ	[LATIN SMALL LETTER E WITH NOTCH]
          case 0xe8: // è	[LATIN SMALL LETTER E WITH GRAVE]
          case 0xe9: // é	[LATIN SMALL LETTER E WITH ACUTE]
          case 0xea: // ê	[LATIN SMALL LETTER E WITH CIRCUMFLEX]
          case 0xeb: // ë	[LATIN SMALL LETTER E WITH DIAERESIS]
          case 0xff45: // ｅ	[FULLWIDTH LATIN SMALL LETTER E]
            replacement = 'e';
            break;
          case 0x11d: // ĝ	[LATIN SMALL LETTER G WITH CIRCUMFLEX]
          case 0x11f: // ğ	[LATIN SMALL LETTER G WITH BREVE]
          case 0x121: // ġ	[LATIN SMALL LETTER G WITH DOT ABOVE]
          case 0x123: // ģ	[LATIN SMALL LETTER G WITH CEDILLA]
          case 0x1d77: // ᵷ	[LATIN SMALL LETTER TURNED G]
          case 0x1d79: // ᵹ	[LATIN SMALL LETTER INSULAR G]
          case 0x1d83: // ᶃ	[LATIN SMALL LETTER G WITH PALATAL HOOK]
          case 0x1e21: // ḡ	[LATIN SMALL LETTER G WITH MACRON]
          case 0x1f5: // ǵ	[LATIN SMALL LETTER G WITH ACUTE]
          case 0x24d6: // ⓖ	[CIRCLED LATIN SMALL LETTER G]
          case 0x260: // ɠ	[LATIN SMALL LETTER G WITH HOOK]
          case 0x261: // ɡ	[LATIN SMALL LETTER SCRIPT G]
          case 0xa77f: // ꝿ	[LATIN SMALL LETTER TURNED INSULAR G]
          case 0xff47: // ｇ	[FULLWIDTH LATIN SMALL LETTER G]
            replacement = 'g';
            break;
          case 0x125: // ĥ	[LATIN SMALL LETTER H WITH CIRCUMFLEX]
          case 0x127: // ħ	[LATIN SMALL LETTER H WITH STROKE]
          case 0x1e23: // ḣ	[LATIN SMALL LETTER H WITH DOT ABOVE]
          case 0x1e25: // ḥ	[LATIN SMALL LETTER H WITH DOT BELOW]
          case 0x1e27: // ḧ	[LATIN SMALL LETTER H WITH DIAERESIS]
          case 0x1e29: // ḩ	[LATIN SMALL LETTER H WITH CEDILLA]
          case 0x1e2b: // ḫ	[LATIN SMALL LETTER H WITH BREVE BELOW]
          case 0x1e96: // ẖ	[LATIN SMALL LETTER H WITH LINE BELOW]
          case 0x21f: // ȟ	[LATIN SMALL LETTER H WITH CARON]
          case 0x24d7: // ⓗ	[CIRCLED LATIN SMALL LETTER H]
          case 0x265: // ɥ	[LATIN SMALL LETTER TURNED H]
          case 0x266: // ɦ	[LATIN SMALL LETTER H WITH HOOK]
          case 0x2ae: // ʮ	[LATIN SMALL LETTER TURNED H WITH FISHHOOK]
          case 0x2af: // ʯ	[LATIN SMALL LETTER TURNED H WITH FISHHOOK AND TAIL]
          case 0x2c68: // ⱨ	[LATIN SMALL LETTER H WITH DESCENDER]
          case 0x2c76: // ⱶ	[LATIN SMALL LETTER HALF H]
          case 0xff48: // ｈ	[FULLWIDTH LATIN SMALL LETTER H]
            replacement = 'h';
            break;
          case 0x129: // ĩ	[LATIN SMALL LETTER I WITH TILDE]
          case 0x12b: // ī	[LATIN SMALL LETTER I WITH MACRON]
          case 0x12d: // ĭ	[LATIN SMALL LETTER I WITH BREVE]
          case 0x12f: // į	[LATIN SMALL LETTER I WITH OGONEK]
          case 0x131: // ı	[LATIN SMALL LETTER DOTLESS I]
          case 0x1d0: // ǐ	[LATIN SMALL LETTER I WITH CARON]
          case 0x1d09: // ᴉ	[LATIN SMALL LETTER TURNED I]
          case 0x1d62: // ᵢ	[LATIN SUBSCRIPT SMALL LETTER I]
          case 0x1d7c: // ᵼ	[LATIN SMALL LETTER IOTA WITH STROKE]
          case 0x1d96: // ᶖ	[LATIN SMALL LETTER I WITH RETROFLEX HOOK]
          case 0x1e2d: // ḭ	[LATIN SMALL LETTER I WITH TILDE BELOW]
          case 0x1e2f: // ḯ	[LATIN SMALL LETTER I WITH DIAERESIS AND ACUTE]
          case 0x1ec9: // ỉ	[LATIN SMALL LETTER I WITH HOOK ABOVE]
          case 0x1ecb: // ị	[LATIN SMALL LETTER I WITH DOT BELOW]
          case 0x2071: // ⁱ	[SUPERSCRIPT LATIN SMALL LETTER I]
          case 0x209: // ȉ	[LATIN SMALL LETTER I WITH DOUBLE GRAVE]
          case 0x20b: // ȋ	[LATIN SMALL LETTER I WITH INVERTED BREVE]
          case 0x24d8: // ⓘ	[CIRCLED LATIN SMALL LETTER I]
          case 0x268: // ɨ	[LATIN SMALL LETTER I WITH STROKE]
          case 0xec: // ì	[LATIN SMALL LETTER I WITH GRAVE]
          case 0xed: // í	[LATIN SMALL LETTER I WITH ACUTE]
          case 0xee: // î	[LATIN SMALL LETTER I WITH CIRCUMFLEX]
          case 0xef: // ï	[LATIN SMALL LETTER I WITH DIAERESIS]
          case 0xff49: // ｉ	[FULLWIDTH LATIN SMALL LETTER I]
            replacement = 'i';
            break;
          case 0x135: // ĵ	[LATIN SMALL LETTER J WITH CIRCUMFLEX]
          case 0x1f0: // ǰ	[LATIN SMALL LETTER J WITH CARON]
          case 0x237: // ȷ	[LATIN SMALL LETTER DOTLESS J]
          case 0x249: // ɉ	[LATIN SMALL LETTER J WITH STROKE]
          case 0x24d9: // ⓙ	[CIRCLED LATIN SMALL LETTER J]
          case 0x25f: // ɟ	[LATIN SMALL LETTER DOTLESS J WITH STROKE]
          case 0x284: // ʄ	[LATIN SMALL LETTER DOTLESS J WITH STROKE AND HOOK]
          case 0x29d: // ʝ	[LATIN SMALL LETTER J WITH CROSSED-TAIL]
          case 0x2c7c: // ⱼ	[LATIN SUBSCRIPT SMALL LETTER J]
          case 0xff4a: // ｊ	[FULLWIDTH LATIN SMALL LETTER J]
            replacement = 'j';
            break;
          case 0x137: // ķ	[LATIN SMALL LETTER K WITH CEDILLA]
          case 0x199: // ƙ	[LATIN SMALL LETTER K WITH HOOK]
          case 0x1d84: // ᶄ	[LATIN SMALL LETTER K WITH PALATAL HOOK]
          case 0x1e31: // ḱ	[LATIN SMALL LETTER K WITH ACUTE]
          case 0x1e33: // ḳ	[LATIN SMALL LETTER K WITH DOT BELOW]
          case 0x1e35: // ḵ	[LATIN SMALL LETTER K WITH LINE BELOW]
          case 0x1e9: // ǩ	[LATIN SMALL LETTER K WITH CARON]
          case 0x24da: // ⓚ	[CIRCLED LATIN SMALL LETTER K]
          case 0x29e: // ʞ	[LATIN SMALL LETTER TURNED K]
          case 0x2c6a: // ⱪ	[LATIN SMALL LETTER K WITH DESCENDER]
          case 0xa741: // ꝁ	[LATIN SMALL LETTER K WITH STROKE]
          case 0xa743: // ꝃ	[LATIN SMALL LETTER K WITH DIAGONAL STROKE]
          case 0xa745: // ꝅ	[LATIN SMALL LETTER K WITH STROKE AND DIAGONAL STROKE]
          case 0xff4b: // ｋ	[FULLWIDTH LATIN SMALL LETTER K]
            replacement = 'k';
            break;
          case 0x13a: // ĺ	[LATIN SMALL LETTER L WITH ACUTE]
          case 0x13c: // ļ	[LATIN SMALL LETTER L WITH CEDILLA]
          case 0x13e: // ľ	[LATIN SMALL LETTER L WITH CARON]
          case 0x140: // ŀ	[LATIN SMALL LETTER L WITH MIDDLE DOT]
          case 0x142: // ł	[LATIN SMALL LETTER L WITH STROKE]
          case 0x19a: // ƚ	[LATIN SMALL LETTER L WITH BAR]
          case 0x1d85: // ᶅ	[LATIN SMALL LETTER L WITH PALATAL HOOK]
          case 0x1e37: // ḷ	[LATIN SMALL LETTER L WITH DOT BELOW]
          case 0x1e39: // ḹ	[LATIN SMALL LETTER L WITH DOT BELOW AND MACRON]
          case 0x1e3b: // ḻ	[LATIN SMALL LETTER L WITH LINE BELOW]
          case 0x1e3d: // ḽ	[LATIN SMALL LETTER L WITH CIRCUMFLEX BELOW]
          case 0x234: // ȴ	[LATIN SMALL LETTER L WITH CURL]
          case 0x24db: // ⓛ	[CIRCLED LATIN SMALL LETTER L]
          case 0x26b: // ɫ	[LATIN SMALL LETTER L WITH MIDDLE TILDE]
          case 0x26c: // ɬ	[LATIN SMALL LETTER L WITH BELT]
          case 0x26d: // ɭ	[LATIN SMALL LETTER L WITH RETROFLEX HOOK]
          case 0x2c61: // ⱡ	[LATIN SMALL LETTER L WITH DOUBLE BAR]
          case 0xa747: // ꝇ	[LATIN SMALL LETTER BROKEN L]
          case 0xa749: // ꝉ	[LATIN SMALL LETTER L WITH HIGH STROKE]
          case 0xa781: // ꞁ	[LATIN SMALL LETTER TURNED L]
          case 0xff4c: // ｌ	[FULLWIDTH LATIN SMALL LETTER L]
            replacement = 'l';
            break;
          case 0x144: // ń	[LATIN SMALL LETTER N WITH ACUTE]
          case 0x146: // ņ	[LATIN SMALL LETTER N WITH CEDILLA]
          case 0x148: // ň	[LATIN SMALL LETTER N WITH CARON]
          case 0x149: // ŉ	[LATIN SMALL LETTER N PRECEDED BY APOSTROPHE]
          case 0x14b: // ŋ	http;//en.wikipedia.org/wiki/Eng_(letter)	[LATIN SMALL LETTER ENG]
          case 0x19e: // ƞ	[LATIN SMALL LETTER N WITH LONG RIGHT LEG]
          case 0x1d70: // ᵰ	[LATIN SMALL LETTER N WITH MIDDLE TILDE]
          case 0x1d87: // ᶇ	[LATIN SMALL LETTER N WITH PALATAL HOOK]
          case 0x1e45: // ṅ	[LATIN SMALL LETTER N WITH DOT ABOVE]
          case 0x1e47: // ṇ	[LATIN SMALL LETTER N WITH DOT BELOW]
          case 0x1e49: // ṉ	[LATIN SMALL LETTER N WITH LINE BELOW]
          case 0x1e4b: // ṋ	[LATIN SMALL LETTER N WITH CIRCUMFLEX BELOW]
          case 0x1f9: // ǹ	[LATIN SMALL LETTER N WITH GRAVE]
          case 0x207f: // ⁿ	[SUPERSCRIPT LATIN SMALL LETTER N]
          case 0x235: // ȵ	[LATIN SMALL LETTER N WITH CURL]
          case 0x24dd: // ⓝ	[CIRCLED LATIN SMALL LETTER N]
          case 0x272: // ɲ	[LATIN SMALL LETTER N WITH LEFT HOOK]
          case 0x273: // ɳ	[LATIN SMALL LETTER N WITH RETROFLEX HOOK]
          case 0xf1: // ñ	[LATIN SMALL LETTER N WITH TILDE]
          case 0xff4e: // ｎ	[FULLWIDTH LATIN SMALL LETTER N]
            replacement = 'n';
            break;
          case 0x14d: // ō	[LATIN SMALL LETTER O WITH MACRON]
          case 0x14f: // ŏ	[LATIN SMALL LETTER O WITH BREVE]
          case 0x151: // ő	[LATIN SMALL LETTER O WITH DOUBLE ACUTE]
          case 0x1a1: // ơ	[LATIN SMALL LETTER O WITH HORN]
          case 0x1d16: // ᴖ	[LATIN SMALL LETTER TOP HALF O]
          case 0x1d17: // ᴗ	[LATIN SMALL LETTER BOTTOM HALF O]
          case 0x1d2: // ǒ	[LATIN SMALL LETTER O WITH CARON]
          case 0x1d97: // ᶗ	[LATIN SMALL LETTER OPEN O WITH RETROFLEX HOOK]
          case 0x1e4d: // ṍ	[LATIN SMALL LETTER O WITH TILDE AND ACUTE]
          case 0x1e4f: // ṏ	[LATIN SMALL LETTER O WITH TILDE AND DIAERESIS]
          case 0x1e51: // ṑ	[LATIN SMALL LETTER O WITH MACRON AND GRAVE]
          case 0x1e53: // ṓ	[LATIN SMALL LETTER O WITH MACRON AND ACUTE]
          case 0x1eb: // ǫ	[LATIN SMALL LETTER O WITH OGONEK]
          case 0x1ecd: // ọ	[LATIN SMALL LETTER O WITH DOT BELOW]
          case 0x1ecf: // ỏ	[LATIN SMALL LETTER O WITH HOOK ABOVE]
          case 0x1ed: // ǭ	[LATIN SMALL LETTER O WITH OGONEK AND MACRON]
          case 0x1ed1: // ố	[LATIN SMALL LETTER O WITH CIRCUMFLEX AND ACUTE]
          case 0x1ed3: // ồ	[LATIN SMALL LETTER O WITH CIRCUMFLEX AND GRAVE]
          case 0x1ed5: // ổ	[LATIN SMALL LETTER O WITH CIRCUMFLEX AND HOOK ABOVE]
          case 0x1ed7: // ỗ	[LATIN SMALL LETTER O WITH CIRCUMFLEX AND TILDE]
          case 0x1ed9: // ộ	[LATIN SMALL LETTER O WITH CIRCUMFLEX AND DOT BELOW]
          case 0x1edb: // ớ	[LATIN SMALL LETTER O WITH HORN AND ACUTE]
          case 0x1edd: // ờ	[LATIN SMALL LETTER O WITH HORN AND GRAVE]
          case 0x1edf: // ở	[LATIN SMALL LETTER O WITH HORN AND HOOK ABOVE]
          case 0x1ee1: // ỡ	[LATIN SMALL LETTER O WITH HORN AND TILDE]
          case 0x1ee3: // ợ	[LATIN SMALL LETTER O WITH HORN AND DOT BELOW]
          case 0x1ff: // ǿ	[LATIN SMALL LETTER O WITH STROKE AND ACUTE]
          case 0x2092: // ₒ	[LATIN SUBSCRIPT SMALL LETTER O]
          case 0x20d: // ȍ	[LATIN SMALL LETTER O WITH DOUBLE GRAVE]
          case 0x20f: // ȏ	[LATIN SMALL LETTER O WITH INVERTED BREVE]
          case 0x22b: // ȫ	[LATIN SMALL LETTER O WITH DIAERESIS AND MACRON]
          case 0x22d: // ȭ	[LATIN SMALL LETTER O WITH TILDE AND MACRON]
          case 0x22f: // ȯ	[LATIN SMALL LETTER O WITH DOT ABOVE]
          case 0x231: // ȱ	[LATIN SMALL LETTER O WITH DOT ABOVE AND MACRON]
          case 0x24de: // ⓞ	[CIRCLED LATIN SMALL LETTER O]
          case 0x254: // ɔ	[LATIN SMALL LETTER OPEN O]
          case 0x275: // ɵ	[LATIN SMALL LETTER BARRED O]
          case 0x2c7a: // ⱺ	[LATIN SMALL LETTER O WITH LOW RING INSIDE]
          case 0xa74b: // ꝋ	[LATIN SMALL LETTER O WITH LONG STROKE OVERLAY]
          case 0xa74d: // ꝍ	[LATIN SMALL LETTER O WITH LOOP]
          case 0xf2: // ò	[LATIN SMALL LETTER O WITH GRAVE]
          case 0xf3: // ó	[LATIN SMALL LETTER O WITH ACUTE]
          case 0xf4: // ô	[LATIN SMALL LETTER O WITH CIRCUMFLEX]
          case 0xf5: // õ	[LATIN SMALL LETTER O WITH TILDE]
          case 0xf6: // ö	[LATIN SMALL LETTER O WITH DIAERESIS]
          case 0xf8: // ø	[LATIN SMALL LETTER O WITH STROKE]
          case 0xff4f: // ｏ	[FULLWIDTH LATIN SMALL LETTER O]
            replacement = 'o';
            break;
          case 0x155: // ŕ	[LATIN SMALL LETTER R WITH ACUTE]
          case 0x157: // ŗ	[LATIN SMALL LETTER R WITH CEDILLA]
          case 0x159: // ř	[LATIN SMALL LETTER R WITH CARON]
          case 0x1d63: // ᵣ	[LATIN SUBSCRIPT SMALL LETTER R]
          case 0x1d72: // ᵲ	[LATIN SMALL LETTER R WITH MIDDLE TILDE]
          case 0x1d73: // ᵳ	[LATIN SMALL LETTER R WITH FISHHOOK AND MIDDLE TILDE]
          case 0x1d89: // ᶉ	[LATIN SMALL LETTER R WITH PALATAL HOOK]
          case 0x1e59: // ṙ	[LATIN SMALL LETTER R WITH DOT ABOVE]
          case 0x1e5b: // ṛ	[LATIN SMALL LETTER R WITH DOT BELOW]
          case 0x1e5d: // ṝ	[LATIN SMALL LETTER R WITH DOT BELOW AND MACRON]
          case 0x1e5f: // ṟ	[LATIN SMALL LETTER R WITH LINE BELOW]
          case 0x211: // ȑ	[LATIN SMALL LETTER R WITH DOUBLE GRAVE]
          case 0x213: // ȓ	[LATIN SMALL LETTER R WITH INVERTED BREVE]
          case 0x24d: // ɍ	[LATIN SMALL LETTER R WITH STROKE]
          case 0x24e1: // ⓡ	[CIRCLED LATIN SMALL LETTER R]
          case 0x27c: // ɼ	[LATIN SMALL LETTER R WITH LONG LEG]
          case 0x27d: // ɽ	[LATIN SMALL LETTER R WITH TAIL]
          case 0x27e: // ɾ	[LATIN SMALL LETTER R WITH FISHHOOK]
          case 0x27f: // ɿ	[LATIN SMALL LETTER REVERSED R WITH FISHHOOK]
          case 0xa75b: // ꝛ	[LATIN SMALL LETTER R ROTUNDA]
          case 0xa783: // ꞃ	[LATIN SMALL LETTER INSULAR R]
          case 0xff52: // ｒ	[FULLWIDTH LATIN SMALL LETTER R]
            replacement = 'r';
            break;
          case 0x15b: // ś	[LATIN SMALL LETTER S WITH ACUTE]
          case 0x15d: // ŝ	[LATIN SMALL LETTER S WITH CIRCUMFLEX]
          case 0x15f: // ş	[LATIN SMALL LETTER S WITH CEDILLA]
          case 0x161: // š	[LATIN SMALL LETTER S WITH CARON]
          case 0x17f: // ſ	http;//en.wikipedia.org/wiki/Long_S	[LATIN SMALL LETTER LONG S]
          case 0x1d74: // ᵴ	[LATIN SMALL LETTER S WITH MIDDLE TILDE]
          case 0x1d8a: // ᶊ	[LATIN SMALL LETTER S WITH PALATAL HOOK]
          case 0x1e61: // ṡ	[LATIN SMALL LETTER S WITH DOT ABOVE]
          case 0x1e63: // ṣ	[LATIN SMALL LETTER S WITH DOT BELOW]
          case 0x1e65: // ṥ	[LATIN SMALL LETTER S WITH ACUTE AND DOT ABOVE]
          case 0x1e67: // ṧ	[LATIN SMALL LETTER S WITH CARON AND DOT ABOVE]
          case 0x1e69: // ṩ	[LATIN SMALL LETTER S WITH DOT BELOW AND DOT ABOVE]
          case 0x1e9c: // ẜ	[LATIN SMALL LETTER LONG S WITH DIAGONAL STROKE]
          case 0x1e9d: // ẝ	[LATIN SMALL LETTER LONG S WITH HIGH STROKE]
          case 0x219: // ș	[LATIN SMALL LETTER S WITH COMMA BELOW]
          case 0x23f: // ȿ	[LATIN SMALL LETTER S WITH SWASH TAIL]
          case 0x24e2: // ⓢ	[CIRCLED LATIN SMALL LETTER S]
          case 0x282: // ʂ	[LATIN SMALL LETTER S WITH HOOK]
          case 0xa784: // Ꞅ	[LATIN CAPITAL LETTER INSULAR S]
          case 0xff53: // ｓ	[FULLWIDTH LATIN SMALL LETTER S]
            replacement = 's';
            break;
          case 0x163: // ţ	[LATIN SMALL LETTER T WITH CEDILLA]
          case 0x165: // ť	[LATIN SMALL LETTER T WITH CARON]
          case 0x167: // ŧ	[LATIN SMALL LETTER T WITH STROKE]
          case 0x1ab: // ƫ	[LATIN SMALL LETTER T WITH PALATAL HOOK]
          case 0x1ad: // ƭ	[LATIN SMALL LETTER T WITH HOOK]
          case 0x1d75: // ᵵ	[LATIN SMALL LETTER T WITH MIDDLE TILDE]
          case 0x1e6b: // ṫ	[LATIN SMALL LETTER T WITH DOT ABOVE]
          case 0x1e6d: // ṭ	[LATIN SMALL LETTER T WITH DOT BELOW]
          case 0x1e6f: // ṯ	[LATIN SMALL LETTER T WITH LINE BELOW]
          case 0x1e71: // ṱ	[LATIN SMALL LETTER T WITH CIRCUMFLEX BELOW]
          case 0x1e97: // ẗ	[LATIN SMALL LETTER T WITH DIAERESIS]
          case 0x21b: // ț	[LATIN SMALL LETTER T WITH COMMA BELOW]
          case 0x236: // ȶ	[LATIN SMALL LETTER T WITH CURL]
          case 0x24e3: // ⓣ	[CIRCLED LATIN SMALL LETTER T]
          case 0x287: // ʇ	[LATIN SMALL LETTER TURNED T]
          case 0x288: // ʈ	[LATIN SMALL LETTER T WITH RETROFLEX HOOK]
          case 0x2c66: // ⱦ	[LATIN SMALL LETTER T WITH DIAGONAL STROKE]
          case 0xff54: // ｔ	[FULLWIDTH LATIN SMALL LETTER T]
            replacement = 't';
            break;
          case 0x169: // ũ	[LATIN SMALL LETTER U WITH TILDE]
          case 0x16b: // ū	[LATIN SMALL LETTER U WITH MACRON]
          case 0x16d: // ŭ	[LATIN SMALL LETTER U WITH BREVE]
          case 0x16f: // ů	[LATIN SMALL LETTER U WITH RING ABOVE]
          case 0x171: // ű	[LATIN SMALL LETTER U WITH DOUBLE ACUTE]
          case 0x173: // ų	[LATIN SMALL LETTER U WITH OGONEK]
          case 0x1b0: // ư	[LATIN SMALL LETTER U WITH HORN]
          case 0x1d4: // ǔ	[LATIN SMALL LETTER U WITH CARON]
          case 0x1d6: // ǖ	[LATIN SMALL LETTER U WITH DIAERESIS AND MACRON]
          case 0x1d64: // ᵤ	[LATIN SUBSCRIPT SMALL LETTER U]
          case 0x1d8: // ǘ	[LATIN SMALL LETTER U WITH DIAERESIS AND ACUTE]
          case 0x1d99: // ᶙ	[LATIN SMALL LETTER U WITH RETROFLEX HOOK]
          case 0x1da: // ǚ	[LATIN SMALL LETTER U WITH DIAERESIS AND CARON]
          case 0x1dc: // ǜ	[LATIN SMALL LETTER U WITH DIAERESIS AND GRAVE]
          case 0x1e73: // ṳ	[LATIN SMALL LETTER U WITH DIAERESIS BELOW]
          case 0x1e75: // ṵ	[LATIN SMALL LETTER U WITH TILDE BELOW]
          case 0x1e77: // ṷ	[LATIN SMALL LETTER U WITH CIRCUMFLEX BELOW]
          case 0x1e79: // ṹ	[LATIN SMALL LETTER U WITH TILDE AND ACUTE]
          case 0x1e7b: // ṻ	[LATIN SMALL LETTER U WITH MACRON AND DIAERESIS]
          case 0x1ee5: // ụ	[LATIN SMALL LETTER U WITH DOT BELOW]
          case 0x1ee7: // ủ	[LATIN SMALL LETTER U WITH HOOK ABOVE]
          case 0x1ee9: // ứ	[LATIN SMALL LETTER U WITH HORN AND ACUTE]
          case 0x1eeb: // ừ	[LATIN SMALL LETTER U WITH HORN AND GRAVE]
          case 0x1eed: // ử	[LATIN SMALL LETTER U WITH HORN AND HOOK ABOVE]
          case 0x1eef: // ữ	[LATIN SMALL LETTER U WITH HORN AND TILDE]
          case 0x1ef1: // ự	[LATIN SMALL LETTER U WITH HORN AND DOT BELOW]
          case 0x215: // ȕ	[LATIN SMALL LETTER U WITH DOUBLE GRAVE]
          case 0x217: // ȗ	[LATIN SMALL LETTER U WITH INVERTED BREVE]
          case 0x24e4: // ⓤ	[CIRCLED LATIN SMALL LETTER U]
          case 0x289: // ʉ	[LATIN SMALL LETTER U BAR]
          case 0xf9: // ù	[LATIN SMALL LETTER U WITH GRAVE]
          case 0xfa: // ú	[LATIN SMALL LETTER U WITH ACUTE]
          case 0xfb: // û	[LATIN SMALL LETTER U WITH CIRCUMFLEX]
          case 0xfc: // ü	[LATIN SMALL LETTER U WITH DIAERESIS]
          case 0xff55: // ｕ	[FULLWIDTH LATIN SMALL LETTER U]
            replacement = 'u';
            break;
          case 0x175: // ŵ	[LATIN SMALL LETTER W WITH CIRCUMFLEX]
          case 0x1bf: // ƿ	http;//en.wikipedia.org/wiki/Wynn	[LATIN LETTER WYNN]
          case 0x1e81: // ẁ	[LATIN SMALL LETTER W WITH GRAVE]
          case 0x1e83: // ẃ	[LATIN SMALL LETTER W WITH ACUTE]
          case 0x1e85: // ẅ	[LATIN SMALL LETTER W WITH DIAERESIS]
          case 0x1e87: // ẇ	[LATIN SMALL LETTER W WITH DOT ABOVE]
          case 0x1e89: // ẉ	[LATIN SMALL LETTER W WITH DOT BELOW]
          case 0x1e98: // ẘ	[LATIN SMALL LETTER W WITH RING ABOVE]
          case 0x24e6: // ⓦ	[CIRCLED LATIN SMALL LETTER W]
          case 0x28d: // ʍ	[LATIN SMALL LETTER TURNED W]
          case 0x2c73: // ⱳ	[LATIN SMALL LETTER W WITH HOOK]
          case 0xff57: // ｗ	[FULLWIDTH LATIN SMALL LETTER W]
            replacement = 'w';
            break;
          case 0x177: // ŷ	[LATIN SMALL LETTER Y WITH CIRCUMFLEX]
          case 0x1b4: // ƴ	[LATIN SMALL LETTER Y WITH HOOK]
          case 0x1e8f: // ẏ	[LATIN SMALL LETTER Y WITH DOT ABOVE]
          case 0x1e99: // ẙ	[LATIN SMALL LETTER Y WITH RING ABOVE]
          case 0x1ef3: // ỳ	[LATIN SMALL LETTER Y WITH GRAVE]
          case 0x1ef5: // ỵ	[LATIN SMALL LETTER Y WITH DOT BELOW]
          case 0x1ef7: // ỷ	[LATIN SMALL LETTER Y WITH HOOK ABOVE]
          case 0x1ef9: // ỹ	[LATIN SMALL LETTER Y WITH TILDE]
          case 0x1eff: // ỿ	[LATIN SMALL LETTER Y WITH LOOP]
          case 0x233: // ȳ	[LATIN SMALL LETTER Y WITH MACRON]
          case 0x24e8: // ⓨ	[CIRCLED LATIN SMALL LETTER Y]
          case 0x24f: // ɏ	[LATIN SMALL LETTER Y WITH STROKE]
          case 0x28e: // ʎ	[LATIN SMALL LETTER TURNED Y]
          case 0xfd: // ý	[LATIN SMALL LETTER Y WITH ACUTE]
          case 0xff: // ÿ	[LATIN SMALL LETTER Y WITH DIAERESIS]
          case 0xff59: // ｙ	[FULLWIDTH LATIN SMALL LETTER Y]
            replacement = 'y';
            break;
          case 0x17a: // ź	[LATIN SMALL LETTER Z WITH ACUTE]
          case 0x17c: // ż	[LATIN SMALL LETTER Z WITH DOT ABOVE]
          case 0x17e: // ž	[LATIN SMALL LETTER Z WITH CARON]
          case 0x1b6: // ƶ	[LATIN SMALL LETTER Z WITH STROKE]
          case 0x1d76: // ᵶ	[LATIN SMALL LETTER Z WITH MIDDLE TILDE]
          case 0x1d8e: // ᶎ	[LATIN SMALL LETTER Z WITH PALATAL HOOK]
          case 0x1e91: // ẑ	[LATIN SMALL LETTER Z WITH CIRCUMFLEX]
          case 0x1e93: // ẓ	[LATIN SMALL LETTER Z WITH DOT BELOW]
          case 0x1e95: // ẕ	[LATIN SMALL LETTER Z WITH LINE BELOW]
          case 0x21d: // ȝ	http;//en.wikipedia.org/wiki/Yogh	[LATIN SMALL LETTER YOGH]
          case 0x225: // ȥ	[LATIN SMALL LETTER Z WITH HOOK]
          case 0x240: // ɀ	[LATIN SMALL LETTER Z WITH SWASH TAIL]
          case 0x24e9: // ⓩ	[CIRCLED LATIN SMALL LETTER Z]
          case 0x290: // ʐ	[LATIN SMALL LETTER Z WITH RETROFLEX HOOK]
          case 0x291: // ʑ	[LATIN SMALL LETTER Z WITH CURL]
          case 0x2c6c: // ⱬ	[LATIN SMALL LETTER Z WITH DESCENDER]
          case 0xa763: // ꝣ	[LATIN SMALL LETTER VISIGOTHIC Z]
          case 0xff5a: // ｚ	[FULLWIDTH LATIN SMALL LETTER Z]
            replacement = 'z';
            break;
          case 0x180: // ƀ	[LATIN SMALL LETTER B WITH STROKE]
          case 0x183: // ƃ	[LATIN SMALL LETTER B WITH TOPBAR]
          case 0x1d6c: // ᵬ	[LATIN SMALL LETTER B WITH MIDDLE TILDE]
          case 0x1d80: // ᶀ	[LATIN SMALL LETTER B WITH PALATAL HOOK]
          case 0x1e03: // ḃ	[LATIN SMALL LETTER B WITH DOT ABOVE]
          case 0x1e05: // ḅ	[LATIN SMALL LETTER B WITH DOT BELOW]
          case 0x1e07: // ḇ	[LATIN SMALL LETTER B WITH LINE BELOW]
          case 0x24d1: // ⓑ	[CIRCLED LATIN SMALL LETTER B]
          case 0x253: // ɓ	[LATIN SMALL LETTER B WITH HOOK]
          case 0xff42: // ｂ	[FULLWIDTH LATIN SMALL LETTER B]
            replacement = 'b';
            break;
          case 0x192: // ƒ	[LATIN SMALL LETTER F WITH HOOK]
          case 0x1d6e: // ᵮ	[LATIN SMALL LETTER F WITH MIDDLE TILDE]
          case 0x1d82: // ᶂ	[LATIN SMALL LETTER F WITH PALATAL HOOK]
          case 0x1e1f: // ḟ	[LATIN SMALL LETTER F WITH DOT ABOVE]
          case 0x1e9b: // ẛ	[LATIN SMALL LETTER LONG S WITH DOT ABOVE]
          case 0x24d5: // ⓕ	[CIRCLED LATIN SMALL LETTER F]
          case 0xa77c: // ꝼ	[LATIN SMALL LETTER INSULAR F]
          case 0xff46: // ｆ	[FULLWIDTH LATIN SMALL LETTER F]
            replacement = 'f';
            break;
          case 0x1a5: // ƥ	[LATIN SMALL LETTER P WITH HOOK]
          case 0x1d71: // ᵱ	[LATIN SMALL LETTER P WITH MIDDLE TILDE]
          case 0x1d7d: // ᵽ	[LATIN SMALL LETTER P WITH STROKE]
          case 0x1d88: // ᶈ	[LATIN SMALL LETTER P WITH PALATAL HOOK]
          case 0x1e55: // ṕ	[LATIN SMALL LETTER P WITH ACUTE]
          case 0x1e57: // ṗ	[LATIN SMALL LETTER P WITH DOT ABOVE]
          case 0x24df: // ⓟ	[CIRCLED LATIN SMALL LETTER P]
          case 0xa751: // ꝑ	[LATIN SMALL LETTER P WITH STROKE THROUGH DESCENDER]
          case 0xa753: // ꝓ	[LATIN SMALL LETTER P WITH FLOURISH]
          case 0xa755: // ꝕ	[LATIN SMALL LETTER P WITH SQUIRREL TAIL]
          case 0xa7fc: // ꟼ	[LATIN EPIGRAPHIC LETTER REVERSED P]
          case 0xff50: // ｐ	[FULLWIDTH LATIN SMALL LETTER P]
            replacement = 'p';
            break;
          case 0x1c6: // ǆ	[LATIN SMALL LETTER DZ WITH CARON]
          case 0x1f3: // ǳ	[LATIN SMALL LETTER DZ]
          case 0x2a3: // ʣ	[LATIN SMALL LETTER DZ DIGRAPH]
          case 0x2a5: // ʥ	[LATIN SMALL LETTER DZ DIGRAPH WITH CURL]
            replacement = 'dz';
            break;
          case 0x1d65: // ᵥ	[LATIN SUBSCRIPT SMALL LETTER V]
          case 0x1d8c: // ᶌ	[LATIN SMALL LETTER V WITH PALATAL HOOK]
          case 0x1e7d: // ṽ	[LATIN SMALL LETTER V WITH TILDE]
          case 0x1e7f: // ṿ	[LATIN SMALL LETTER V WITH DOT BELOW]
          case 0x24e5: // ⓥ	[CIRCLED LATIN SMALL LETTER V]
          case 0x28b: // ʋ	[LATIN SMALL LETTER V WITH HOOK]
          case 0x28c: // ʌ	[LATIN SMALL LETTER TURNED V]
          case 0x2c71: // ⱱ	[LATIN SMALL LETTER V WITH RIGHT HOOK]
          case 0x2c74: // ⱴ	[LATIN SMALL LETTER V WITH CURL]
          case 0xa75f: // ꝟ	[LATIN SMALL LETTER V WITH DIAGONAL STROKE]
          case 0xff56: // ｖ	[FULLWIDTH LATIN SMALL LETTER V]
            replacement = 'v';
            break;
          case 0x1d6f: // ᵯ	[LATIN SMALL LETTER M WITH MIDDLE TILDE]
          case 0x1d86: // ᶆ	[LATIN SMALL LETTER M WITH PALATAL HOOK]
          case 0x1e3f: // ḿ	[LATIN SMALL LETTER M WITH ACUTE]
          case 0x1e41: // ṁ	[LATIN SMALL LETTER M WITH DOT ABOVE]
          case 0x1e43: // ṃ	[LATIN SMALL LETTER M WITH DOT BELOW]
          case 0x24dc: // ⓜ	[CIRCLED LATIN SMALL LETTER M]
          case 0x26f: // ɯ	[LATIN SMALL LETTER TURNED M]
          case 0x270: // ɰ	[LATIN SMALL LETTER TURNED M WITH LONG LEG]
          case 0x271: // ɱ	[LATIN SMALL LETTER M WITH HOOK]
          case 0xff4d: // ｍ	[FULLWIDTH LATIN SMALL LETTER M]
            replacement = 'm';
            break;
          case 0x1d8d: // ᶍ	[LATIN SMALL LETTER X WITH PALATAL HOOK]
          case 0x1e8b: // ẋ	[LATIN SMALL LETTER X WITH DOT ABOVE]
          case 0x1e8d: // ẍ	[LATIN SMALL LETTER X WITH DIAERESIS]
          case 0x2093: // ₓ	[LATIN SUBSCRIPT SMALL LETTER X]
          case 0x24e7: // ⓧ	[CIRCLED LATIN SMALL LETTER X]
          case 0xff58: // ｘ	[FULLWIDTH LATIN SMALL LETTER X]
            replacement = 'x';
            break;
          default:
            // we assume character is not a letter so we pass it on
            replacement = this.charAt(i);
            break;
        }
        // add it to string
        outStr += upper ? replacement.toUpperCase() : replacement;
      }
    }
  }
  return outStr;
}
