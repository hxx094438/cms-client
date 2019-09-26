<template>
  <div class="toast" v-if="visable">
    <v-touch class="toast-mask" @touchmove.prevent @tap="handleMask"></v-touch>
    <div class="toast-cont">
      <i class="icon icon-loading" v-if="type === 'loading'"></i>
      <i class="icon icon-success" v-if="type === 'success'"></i>
      <i class="icon icon-fail" v-if="type === 'fail'"></i>
      <span class="toast-text">{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    time: {
      type: Number,
      default() {
        return this.type === 'loading' ? 0 : 3000
      }
    },
    text: {
      type: String,
      default() {
        switch (this.type) {
          case 'loading':
            return '加载中...'
          case 'success':
            return '操作成功'
          case 'fail':
            return '操作失败'
          default:
            return ''
        }
      }
    }
  },
  data() {
    return {
      visable: true
    }
  },
  mounted() {
    this.time !== 0 && this._setTimer()
  },
  methods: {
    handleMask() {
      this.type !== 'loading' && this.close()
    },
    close() {
      this.visable = false
      clearTimeout(this._timer)
      this.$emit('close')
    },
    _setTimer() {
      this._timer = setTimeout(() => {
        this.close()
      }, this.time)
    }
  },
  destoryed() {
    clearTimeout(this._timer)
  }
}
</script>

<style lang="scss" scoped>

@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

.toast-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 12;
}
.toast-cont {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 0);
  max-width: 80%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 12;
  padding: 10px;
  color: #fff;
  font-size: 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .icon {
    margin-right: 5px;
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }
  .icon-success {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADe0lEQVR4Xu2ZPcgUVxSGn1dFJAjKJxYWEi0sLEwKCYqKIDGYKEoEExWipvEHjKVYaCNCCtEqVn5FooVoIYpgLBQSAokxRQobixQGLFJEbCL58Yc3HJgPlmF3ZnZ+ZGd3Trsz9973mXPOvfddMeGhCddPB6DLgAkn0JXAhCdA1wS7EuhKYMIJdCUw4QnQ7QJdCXQlMOEEuhIYtwSwvRw4BrwLnJb0Q5bGscqARPwDYHEi+m9goaSXgyCMDQDbS4AQv7RH7CtgStJfYw3A9hTwM7AiJfSspBNjXQK2FwBR5++khF4D9kry2AKw/VYifnVK5E1gl6TXeU2+tT3A9lzgLrAxJfIe8JGkqP/caCUA27OBW8DWlMLoA5sk/ZurPHmgdQBszwKuALtTIh8C6yU9Lyo+nmsjgMvAvpTI34C1kp4NI751AGx/BXyREvk7sE7SH8OKbxUA26eAMymRIXqNpCdlxLcGgO2DwMWUyEj3SPtI/9Ix8j3AdtT7pVS/ikYXDS8aX6XIBWB7FXA+WcAJSb9WmnGIl21/DFwHovPPRGxxsdXFllc5igD4BXgvmSnIb5H0U+WZcwawvRm4A8zpefQFsE1SHHZqiSIAngKLemb7Jw4gkr6vZQV9BrG9FvgOmNfzcxxrd0j6ts55iwA4AHydqsH/gA+bgGA7zvUBd36P0LjQxMUmLji1Ri6AmM32fuCbPhC2S4rzeC1heyVwH4gbXm8ckjRdyySpQQoByIAQTstOSberLq6PmzMz5ElJX1Ydf9D7hQFkQIhb16eSbpRd5AA3J4Y7J+l42XGLvDcUgAwI0aA+KQPBdvh3P/Zxc6YlHSoiosozQwPIgfCZpKtFF5S4OVHzUfu9UcjNKTpP1nOlAGRAiG79uaS4sWVGhpsT21xsd7luTt4cRX4vDaAKhAw3J7y9DyTFgeeNRCUAORAO99u6ctyc9yWFl//GojKABMKexKVJj3dM0oUZNXW7OXVQqgVAUQi2a3VzRgpADoTYy9/u4+aEkRGGRik3Z+QA5EBIr/fPRPzjOoSUHaO2EuhdgO1BPWHmsXBzNkh6VHbhdb3XCICcTKjNzakDQmMABkCo1c0ZeQAJhPD0jgLLgCOS4n+7kYlGM2BkVGYspAPQhq/U5Bq7DGiSbhvG7jKgDV+pyTV2GdAk3TaM3WVAG75Sk2uc+Az4HxujF1A9BN1OAAAAAElFTkSuQmCC) no-repeat center / 100% 100%;
  }
  .icon-fail{
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADaElEQVR4Xu2aOasUQRRGz4cbgrn7jzAwMXqIuIGK+0NUDFwSzXymmolLpqBoIu7ihgouIEYmCuIPMBPU9wNEUJQr9eiBcuyemequqoGZ7nCmpqrO6e/enu4ZMeaHxpyfVkCbgDE30JbAmAegbYJtCbQlMOYG2hIIDYCZLQUuAwuAs5JehM4Rc7yZrQDOwExDPyHpY8j8wQkws7vA7mKRP8A2SU9DFo011sxWAm+Kk+Gm/SZpScj8dQS8B9zCneM3sD23hBJ4t59pSYtTC1gLPAPmDktCBbzbzj5JN5MKcJOb2XrgyTAkVMAbcETS1RB4Nza4BDoLDEOCma0CXnk1P3M+gAOSrofCNxKQOwkF/GtgvgfaCL6xAE+C6wmzU/WEVPBRBBQSNgMPU0hICR9NQCoJqeGjCugh4RewRdLLkCbVA36PJPdlLMpR+ypQtbqZlZVDkAQzmwCelzS8qPDRE+BdImtLKOBdWuZ1dfvo8MkE1C2H3PBJBYRKGAZ8cgGehEfALC/S//SECnh3p7k3ZsMr61vRm2DZIma2A3Cd+z8JgAN1X6T8mnev7ZT0OEqr7zFJFgFFEqokuD3M8faYDT5LCfjyK5LgD8kKn11AjyS4t7LDD0vAVuB+Vz/oCJiU9CB13fvzZ+sBxdmvgu/sKfszxmwCzKwffEdC1meMWQSY2STgntX5l0EHPAUsBI53xT6bhOQCCvjbJY/fpiSdL0rjJHCqRMKm0LvI0P6RVMAg8J0Nm5lLwbkugKC7yFD4pFeBEPhhSkiSgDrwA0jYIMn9ChT1iC6gB/wxSRcH2X1FOfwENsaWEFWAme0HrpU0vIHh+yQhuoRoAmLCexKOAhe6UuMkrJH0dpA09RsTRUAK+D4SfgDrYkhoLCAlfA4JjQTkgB9AwmpJ7/pFver92gJywveR8L3oCbUk1BLQA/5wnZ+oQ86emZU1xtoSggWYmft7zJ2SS11yeC8Jh4ArXeKchAlJH0KE1hEwXdzB+etkg+8j4ask9yeugY86Aj4Dy70VssP3kPBF0rKB6ev8Q8TMdgG3gE/AaUk3QhaMPdbMDgKXinnd7wj3QtYITkDI5LnGmtkit5YkV55Bx0gICCLuGtwKaGJvFD7bJmAUzmIThjYBTeyNwmfbBIzCWWzC0Cagib1R+OxfC8CiUElxe8wAAAAASUVORK5CYII=) no-repeat center / 100% 100%;
  }
  .icon-loading {
    // font-size: pxToRem(40);
    // line-height: pxToRem(40);
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADKUlEQVR4Xu2b4XEUMQyFnyoAKgAqADogFUAHkAoIFQAVECoAOiAVkBKSCgIdQAViHmPPmL3d2LK07OXO/rt7st5n2StbPsGRNzly/RgARgRsREBVXwN4l7p/KyLftnBlsymgqjcAHiXRVyLy7NgAaClYRDYZjE06pXBVHQBGBBQExhS4K2uAqt4H8AbAhYhc9a7ckWuAqj4F8ALAJxH5ZfHJtAgm8fx8EQLbqYh8sXSY340CkPKJz8kuxT+2QLACYPKSO8tauiBEAJiI7/LHCoAj/wPAvcmomyF4ASyI/83karUISN/vuSgwTwcPgAXxZh/4A1MEFPPXDUFVGUkPk81rEeFCVm2R4rsBRESCqr4EcA6AC9eZiFzW1EeLdwGIgFATXD5fQ7wbQAXCScuotkBQ1ecAvs+8a158pza61oCpkYXR+SoiXCvcTVWZa7zyfnnmHAkBsBAJPOTgHHc3VT0D8LEw5B75bCsMQILAUKWzl1His6MJAu2fR02tkDXAPbwbGwiNgI21dHU/AHRhO6AfjQg4oMHskjIiYCGrY8UmFy1qZLmrY2JS3czUDFmep80UkyOLnzsVqJ0ImFRsWn3675WdKD/nAJT79FYAzfv5VoO19ybnCbXX8/MdP+cAcJ/+HsCTRqvXrfv5RntNr6UNGP3Mhyq13836ORbBGrZDfz4i4NBHuKZvRECN0KE/HxEQOcKpeJprh0w7mVSFNFVl2sviyYfItDssApJ4Hl3nCg/PBU8i1M+cOu/XoeiM+Kz7gaVQuQRLVXmFjvX/soVAcEfALeJ5WYEnxO62t4WRW8SHFUUyvb0rjXnF99wUXQNC1xTwiueo9t4UjYZgBhAhPgHovigZCaEHAD91LFGVzTznPTdEEsClSxq8JNWcf/QA+GfkAJjFeyOgsjCayvI9AFjx5T1Bti7xUQBmIuEnEzFL7mEGkDr9OwU8Kal3CpTzT1V5MswMlNnnehcl3RlNYSASgMevrgjwdFjM3+6vQET/2cYAEEnTYmtMgfGPkb6bopYoa3l3yzUgV6DoZ9NN0RZB1nc2A2B1dK33B4C1yN4Vu0cfAX8Apr+XUCYk2CYAAAAASUVORK5CYII=) no-repeat center / 100% 100%;
    // transform-origin: 45% 45%;
    transform-origin: 50% 50%;
    animation: loading 1s linear infinite;
  }
}
</style>
