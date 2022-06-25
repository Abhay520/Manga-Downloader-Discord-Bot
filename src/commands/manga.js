//Uses mangadex api to download a volume of a manga
//Note: the manga id is needed from the mangadex website, as well as a volume number

const { SlashCommandBuilder } = require('@discordjs/builders')

const axios = require('axios')
const fs = require('fs')

const PDFDocument = require('pdfkit')

const { google } = require('googleapis')

//file containing google drive credentials for the uploading of pdf files
const KEYFILEPATH = './config/googleDriveCred.json'

class Manga {
  //assigns manga id
  constructor (id) {
    this.manga_id = id
  }

  //function which returns an array containing all the cover images filename, as well as their volume no.
  //returns a promise
  getVolumeCover = async volumeNo => {
    return axios
      .get(`https://api.mangadex.org/cover?manga[]=${this.manga_id}&&limit=99`)
      .then(res => {
        //getting volumeCovers in form of 2d array containing [volumeno.,filename]
        const dataArray = res.data.data
        for (let data in dataArray) {
          if (parseInt(dataArray[data].attributes.volume) == volumeNo) {
            return dataArray[data].attributes.fileName
          }
        }
        throw err;
      })
  }

  downloadCoverImage = async volumeNo => {
    await this.getVolumeCover(volumeNo).then(res => {
      console.log('Downloading volume cover for volume number ' + volumeNo)
      download_image(
        `https://uploads.mangadex.org/covers/${this.manga_id}/${res}`,
        `manga/${volumeNo}.jpg`
      )
    })
  }

  getChapterIDsOfVolume = volumeNo => {
    return axios
      .get(
        `https://api.mangadex.org/manga/${this.manga_id}/aggregate?translatedLanguage[]=en`
      )
      .then(res => {
        const chapterIDs = []
        const chapters = res.data.volumes[`${volumeNo}`].chapters
        //storing the chap numbers and id of the volume in 2d array in form [chapno. ,chapid]
        for (let chap in chapters) {
          const chapterNo = parseFloat(
            res.data.volumes[`${volumeNo}`].chapters[`${chap}`].chapter
          )
          const chapterId =
            res.data.volumes[`${volumeNo}`].chapters[`${chap}`].id
          chapterIDs.push([chapterNo, chapterId])
        }
        //sorting chapter names in ascending order
        chapterIDs.sort(function (a, b) {
          if (a[0] === b[0]) return 0
          else return a[0] < b[0] ? -1 : 1
        })
        return chapterIDs
      })
  }

  downloadVolume = async volumeNo => {
    //creating manga directory
    let directory = "manga/"
    if (!fs.existsSync(directory)){fs.mkdirSync(directory);}
    const start = Date.now()
    let mangaName
    await this.getMangaName().then(res => {
      mangaName = res
    })
    await this.downloadCoverImage(volumeNo)
    await new Promise(resolve => setTimeout(resolve, 3000))
    const document = new PDFDocument({ size: 'A4' })
    document.pipe(
      fs.createWriteStream(`${directory}${mangaName}_Volume${volumeNo}.pdf`)
    )
    let manga_chapids, manga_pageids, hash
    let chap_dir = `${directory}/chapter`
    let coverImagePath = `${directory}/${volumeNo}.jpg`
    //store all the chapter ids in manga_chapids in form of a nested array [[name of chapter, chapter_id]]
    await this.getChapterIDsOfVolume(volumeNo).then(res => {
      manga_chapids = res
    })
    //add cover image of current volume to document
    document.image(coverImagePath, { fit: [500, 1000], align: 'center' })
    console.log('Downloading manga ' + mangaName + ' Volume no. ' + volumeNo)
    console.log(
      'Note : This volume contains ' + manga_chapids.length + ' chapters'
    )
    //for each chapter of the volume
    for (let i = 0; i < manga_chapids.length; i++) {
      await this.getPageIDsOfChap(manga_chapids[i][1])
        .then(res => {
          //store chapter's hash in hash and the page ids in manga_pageids (an array containing only page-ids)
          hash = res.chapter.hash
          manga_pageids = res.chapter.dataSaver
        })
      //for debugging
      console.log('Downloading chapter ' + manga_chapids[i][0])
      //create a directory for the chapter if it doesnt already exist
      if (!fs.existsSync(`${chap_dir} ${manga_chapids[i][0]}`)) {
        fs.mkdirSync(`${chap_dir} ${manga_chapids[i][0]}`, { recursive: true })
      }
      for (let j = 0; j < manga_pageids.length; j++) {
        console.log('Downloading page number ' + (j + 1))
        await download_image(
          `https://uploads.mangadex.org/data-saver/${hash}/${manga_pageids[j]}`,
          `${chap_dir} ${manga_chapids[i][0]}/page ${j + 1}.jpg`
        )
        await new Promise(resolve => setTimeout(resolve, 300))
        document.addPage()
        document.image(`${chap_dir} ${manga_chapids[i][0]}/page ${j + 1}.jpg`, {
          fit: [500, 1000],
          align: 'center'
        })
      }
      //deleting image chapter directory, leaving only pdf files
      fs.rm(`${chap_dir} ${manga_chapids[i][0]}`, { recursive: true }, err => {
        if (err) console.log(err)
      })
    }
    document.end()
    //deleting cover image leaving only pdf files
    fs.unlink(coverImagePath, err => {
      if (err) {
        console.error(err)
      }
    })
    const duration = Date.now() - start
    console.log(
      `Downloading finished!! Time taken is ${duration / 1000 / 60} mins`
    )
  }

  //returns array containing page ids of the chap
  getPageIDsOfChap = async chap_id => {
    return await axios
      .get(`https://api.mangadex.org/at-home/server/${chap_id}`)
      .then(res => {
        return res.data
      })
  }

  //function which returns shortest english name of the manga (returns a promise) and removes non-alphabets
  getMangaName = () => {
    return axios
      .get(`https://api.mangadex.org/manga/${this.manga_id}`)
      .then(res => {
        // return res.data.data.attributes.title.en
        let names = []
        names.push(res.data.data.attributes.title.en)
        const titleArray = res.data.data.attributes.altTitles
        for (let i = 0; i < titleArray.length; i++) {
          if (Object.keys(titleArray[i]) == 'en') {
            names.push(titleArray[i].en)
          }
        }
        const shorter = (left, right) =>
          left.length <= right.length ? left : right
        let name = names.reduce(shorter)
        return name.replace(/[^0-9a-z] /gi, ' ')
      })
  }

  //uploads volume to google drive
  uploadVolume (volumeNo) {
    return this.getMangaName()
      .then(res => {
        return res
      })
      .then(mangaName => {
        return createAndUploadFile(`${mangaName}_Volume${volumeNo}.pdf`)
      })
  }
}

const download_image = async (url, image_path) => {
  return axios({ url, responseType: 'stream' })
    .then(
      response =>
        new Promise((resolve, reject) => {
          response.data
            .pipe(fs.createWriteStream(image_path))
            .on('finish', () => resolve())
            .on('error', e => reject(e))
        })
    )
}

//uses google drive api to create and upload pdf manga volume
const createAndUploadFile = async mangaName => {
  //drive scope gives full access to google drive account
  const SCOPES = ['https://www.googleapis.com/auth/drive']
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
  })
  //handles all authorization
  const drive = google.drive({ version: 'v3', auth })

  let fileMetaData = {
    name: mangaName,
    mimeType: 'application/pdf',
    parents: ['1Wnw2lldLFcY31ja4gxb0qz4YmNy8yO0F']
  }
  let media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream(`manga/${mangaName}`)
  }

  let response = await drive.files.create({
    resource: fileMetaData,
    media: media,
    fields: 'id'
  })

  switch (response.status) {
    case 200:
      return `https://drive.google.com/file/d/${response.data.id}/view?usp=sharing`
    default:
      return 'Error created file, ' + response.errors
  }
}

//const manga = new Manga('801513ba-a712-498c-8f57-cae55b38cc92');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('manga_download')
    .setDescription('uses mangadex api to perform certain functions')
    .addStringOption(option =>
      option
        .setName('manga_id')
        .setDescription('manga_id from mangadex')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('volume_no')
        .setDescription('volume number')
        .setRequired(true)
    ),
  async execute (interaction) {
    const manga_id = interaction.options.get('manga_id').value
    const volumeNumber = interaction.options.get('volume_no').value
    const manga = new Manga(manga_id)
    await interaction.deferReply()
    try{
      await manga.downloadVolume(volumeNumber)
      await manga.uploadVolume(volumeNumber).then(res => {
        interaction.editReply(res)
      })
    }
    catch(err){
      fs.rm("manga/", { recursive: true }, (err) => {if (err) throw err;});
      interaction.editReply("An error occured, make sure the manga_id and volume number is valid")
    }
  }
}

