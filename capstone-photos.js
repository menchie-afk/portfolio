const capstonePhotoList = document.getElementById('capstonePhotoList');
    const capstoneViewAll = document.getElementById('capstoneViewAll');
    const additionalCapstonePhotos = [
      '662201442_2184818562292390_2640311331270104148_n (1).png',
      '662497703_946964034988398_7462972316182462988_n (2).png',
      '663956882_949086397612496_8902666989732644527_n (1).png',
      '664111110_953461380394242_4433925709163618167_n (1).png',
      '664274124_1677575286755515_1948634741654062393_n (1).jpg',
      '664345124_1086407747890409_3193483480994496928_n (2).png',
      '664362137_2038300967033182_25907241600807066_n.jpg',
      '664381546_955420456988462_1185678032145789316_n (1).jpg',
      '664630380_1890392364957940_7201210054195080624_n (1).jpg',
      '664742884_2478217039305497_1702764106714421557_n (1).jpg',
      '664794318_1655728372102454_9137902483159117077_n (1).jpg',
      '664796735_1113561660955569_2437277869080001640_n (1).jpg',
      '664802770_1228909235930950_1603022893798988553_n (1).jpg',
      '664817187_969959499320490_5145182827993393071_n (1).jpg',
      '664831759_953257197352272_7539167942836864810_n (1).jpg',
      '664844069_1266933992277892_5846529273332205148_n (1).jpg',
      '664844069_3941137546178610_3319332618831895751_n (1).jpg',
      '664906072_2331653853992526_6500327554670112171_n (1).jpg',
      '664912122_834584212314751_5858507527604151299_n (1).jpg',
      '664929237_2131362607704014_2941722383885248080_n (1).png',
      '665129867_1226762895911836_2536272924127531282_n (1).jpg',
      '665184327_1449088782832256_5760384837800827973_n (1).jpg',
      '665191335_1595050191720670_5101110701171908926_n.jpg',
      '665219477_1675468513492151_5742178166036529858_n.jpg',
      '665929375_1284465950281593_7751530681140790082_n (1).png',
      '666019259_1281883309971289_3296280773926368169_n (1).png',
      '666154003_895183416890077_5361844690413519297_n (1).jpg',
      '666205857_1674516270650379_8343915741527796047_n (2).jpg',
      '666298983_3936042416529261_3440994247035476773_n (1).jpg',
      '666307311_1497012755331146_2047741543296253546_n (1).jpg',
      '666371331_935169809102301_6583788027744093100_n (1).jpg',
      '666483892_2108589189926073_8306930173888645910_n (1).jpg',
      '666489603_1600956244352887_795575890832509604_n (1).jpg',
      '666976531_949638180939876_2323844391402119743_n (1).jpg',
      '667738047_1671682850953403_3511494742634170784_n (1).jpg',
      '667788554_26950005881264017_8108880794253698901_n.jpg',
      '667798097_962196826257884_7359678698328593243_n (1).png',
      '668002473_1259138125846543_7502665231864739436_n (1).jpg',
      '668088878_2180315962780170_6087459327924456172_n (1).jpg',
      '668767394_1268034794866185_7347786251535419399_n (1).png',
      '668985730_969346608889004_6342613480385076224_n (1).png',
      '669684041_892339470497017_1019639600744924284_n.jpg',
      '670152124_1459655605953552_8487402960210200647_n.jpg'
    ];
    let showAllCapstonePhotos = false;

    function renderAdditionalCapstonePhotos() {
      const photosToShow = showAllCapstonePhotos
        ? additionalCapstonePhotos
        : additionalCapstonePhotos.slice(0, 8);

      capstonePhotoList.classList.toggle('is-expanded', showAllCapstonePhotos);
      capstonePhotoList.replaceChildren(...photosToShow.map((fileName, index) => {
        const link = document.createElement('a');
        const image = document.createElement('img');
        const filePath = `https://meaphghtpvkjylcawzhq.supabase.co/storage/v1/object/public/Portfolio/assets/caps/${encodeURIComponent(fileName).replace(/%2F/g, '/')}`;

        link.className = 'capstone-photo-link';
        link.href = filePath;
        link.target = '_blank';
        link.rel = 'noopener';
        link.setAttribute('aria-label', `Open capstone photo ${index + 1}`);

        image.src = filePath;
        image.alt = `Capstone project photo ${index + 1}`;
        image.loading = 'lazy';
        link.append(image);
        return link;
      }));

      capstoneViewAll.textContent = showAllCapstonePhotos
        ? 'Show fewer'
        : `View all ${additionalCapstonePhotos.length} photos`;
      capstoneViewAll.setAttribute('aria-expanded', String(showAllCapstonePhotos));
    }

    capstoneViewAll.addEventListener('click', () => {
      showAllCapstonePhotos = !showAllCapstonePhotos;
      renderAdditionalCapstonePhotos();
    });

    renderAdditionalCapstonePhotos();
